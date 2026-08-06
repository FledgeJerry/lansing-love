"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What is the Full Accounting?",
  "Who funded the Lansing city council?",
  "What happened to the City Market?",
  "What is polycentric governance?",
];

function renderMessage(text: string) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--color-dome-gold)">$1</a>')
    .replace(/\n/g, "<br/>");
}

export default function AskLansing() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setStarted(true);
    if (!open) setOpen(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content ?? "Something went wrong. Try the /search page or email jerry@thefledge.com." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection issue. Try the /search page." }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, open]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask Lansing.love"
          style={{
            position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 200,
            background: "var(--color-dome-gold, #C9A84C)",
            color: "#0a0e14",
            border: "none",
            borderRadius: "100px",
            padding: "0.65rem 1.1rem",
            fontSize: "0.82rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "var(--font-sans)",
          }}
        >
          <span style={{ fontSize: "1rem" }}>💬</span> Ask Lansing.love
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", justifyContent: "flex-end" }}>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
          />

          <div style={{
            position: "relative", zIndex: 1,
            width: "min(520px, 100vw)",
            height: "100%",
            background: "var(--color-surface, #0f1923)",
            borderLeft: "1px solid rgba(244,241,232,0.08)",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Header */}
            <div style={{
              padding: "1.1rem 1.5rem",
              background: "rgba(10,14,20,0.95)",
              borderBottom: "1px solid rgba(244,241,232,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-limestone, #F4F1E8)", letterSpacing: "0.02em" }}>
                  Ask <span style={{ color: "var(--color-dome-gold, #C9A84C)" }}>Lansing.love</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--color-steel-muted, rgba(154,176,200,0.6))", marginTop: "0.1rem" }}>
                  Civic intelligence · polycentric governance
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(244,241,232,0.4)", fontSize: "1.3rem", lineHeight: 1, padding: "0.2rem 0.4rem" }}
              >✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {!started && (
                <div style={{
                  maxWidth: "88%", padding: "0.875rem 1.1rem",
                  borderRadius: "12px 12px 12px 4px",
                  background: "rgba(154,176,200,0.08)",
                  border: "1px solid rgba(154,176,200,0.12)",
                  fontSize: "0.88rem", lineHeight: 1.65, color: "var(--color-text, #c8d0d8)",
                }}>
                  I can help you navigate Lansing&apos;s governance record — the Full Accounting cases, the pattern language, who sits on which boards, and what the city&apos;s civic prediction record looks like. What do you want to know?
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "0.75rem 1.1rem",
                      borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                      background: msg.role === "user" ? "rgba(201,168,76,0.15)" : "rgba(154,176,200,0.08)",
                      border: `1px solid ${msg.role === "user" ? "rgba(201,168,76,0.3)" : "rgba(154,176,200,0.12)"}`,
                      color: "var(--color-text, #c8d0d8)",
                      fontSize: "0.88rem",
                      lineHeight: 1.65,
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                  />
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ padding: "0.75rem 1.1rem", borderRadius: "12px 12px 12px 4px", background: "rgba(154,176,200,0.08)", border: "1px solid rgba(154,176,200,0.12)", color: "var(--color-steel-muted)", fontSize: "0.88rem" }}>
                    Thinking…
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {!started && (
              <div style={{ padding: "0 1.5rem 0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap", flexShrink: 0 }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      background: "rgba(154,176,200,0.07)",
                      border: "1px solid rgba(154,176,200,0.18)",
                      borderRadius: "100px",
                      color: "rgba(154,176,200,0.75)",
                      fontSize: "0.75rem",
                      padding: "0.3rem 0.8rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                    }}
                  >{s}</button>
                ))}
              </div>
            )}

            {/* Also try search */}
            <div style={{ padding: "0.5rem 1.5rem", borderTop: "1px solid rgba(244,241,232,0.06)", display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
              <span style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)" }}>Looking for something specific?</span>
              <button
                onClick={() => { setOpen(false); router.push("/search"); }}
                style={{ fontSize: "0.72rem", color: "var(--color-dome-gold)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-sans)" }}
              >
                Search the site →
              </button>
            </div>

            {/* Input */}
            <div style={{ padding: "0.9rem 1.5rem", borderTop: "1px solid rgba(244,241,232,0.08)", display: "flex", gap: "0.6rem", flexShrink: 0 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Lansing governance…"
                style={{ flex: 1, fontSize: "0.88rem" }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="btn btn--primary btn--sm"
                style={{ flexShrink: 0 }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
