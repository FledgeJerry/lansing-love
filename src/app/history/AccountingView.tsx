"use client";

import { useState, useMemo } from "react";
import LedgerOverTimeChart from "@/components/charts/LedgerOverTimeChart";

const FLOW_TYPE_LABELS: Record<string, string> = {
  public_investment: "Public Investment",
  private_extraction: "Private Extraction",
  public_cleanup: "Public Cleanup",
  sale: "Sale",
  subsidy: "Subsidy",
  tax_abatement: "Tax Abatement",
  developer_fee: "Developer Fee",
  eminent_domain: "Eminent Domain",
  remediation: "Remediation",
  grant: "Grant",
  penalty: "Penalty",
  legal: "Legal Action",
  public_cost: "Public Cost",
};

function formatCents(cents: string | null): string {
  if (!cents || cents === "0") return "$0";
  const n = Number(cents);
  if (n >= 100_000_000_000) return `$${(n / 100_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000_00) return `$${(n / 1_000_000_00).toFixed(1)}M`;
  if (n >= 1_000_00) return `$${(n / 1_000_00).toFixed(0)}K`;
  return `$${(n / 100).toFixed(0)}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.getFullYear().toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AccountingView({ dollarFlows }: { dollarFlows: any[] }) {
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");

  const filtered = useMemo(() => {
    if (filter === "public") return dollarFlows.filter((f) => f.isPublicCost);
    if (filter === "private") return dollarFlows.filter((f) => f.isPrivateGain);
    return dollarFlows;
  }, [dollarFlows, filter]);

  const totals = useMemo(() => {
    let publicCost = BigInt(0);
    let privateGain = BigInt(0);
    dollarFlows.forEach((f) => {
      if (f.amountCents) {
        if (f.isPublicCost) publicCost += BigInt(f.amountCents);
        if (f.isPrivateGain) privateGain += BigInt(f.amountCents);
      }
    });
    return { publicCost: publicCost.toString(), privateGain: privateGain.toString() };
  }, [dollarFlows]);

  return (
    <div>
      {/* Scoreboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1.25rem", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Total public cost</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#E87070", fontFamily: "var(--font-mono)" }}>
            {formatCents(totals.publicCost)}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
            borne by the public
          </div>
        </div>
        <div style={{ padding: "1.25rem", background: "rgba(139,91,246,0.1)", border: "1px solid rgba(139,91,246,0.3)", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Total private gain</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#B48FFF", fontFamily: "var(--font-mono)" }}>
            {formatCents(totals.privateGain)}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
            extracted privately
          </div>
        </div>
      </div>

      <LedgerOverTimeChart dollarFlows={dollarFlows} />

      {/* Filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {(["all", "public", "private"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.3rem 0.9rem",
              borderRadius: "5px",
              border: "1px solid",
              borderColor: filter === f ? "var(--color-dome-gold)" : "var(--color-border-strong)",
              background: filter === f ? "var(--color-dome-gold)" : "var(--color-surface)",
              color: filter === f ? "var(--color-midnight-steel)" : "var(--color-text-secondary)",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            {f === "all" ? "All flows" : f === "public" ? "Public costs" : "Private gains"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Type</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Amount</th>
              <th style={thStyle}>Tags</th>
              <th style={thStyle}>Source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((flow) => (
              <tr key={flow.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={tdStyle}>{formatDate(flow.flowDate)}</td>
                <td style={{ ...tdStyle, maxWidth: "300px" }}>
                  {flow.isPublic === false && (
                    <span style={{ fontSize: "0.6rem", padding: "1px 4px", borderRadius: "3px", background: "rgba(0,0,0,0.3)", color: "#c0392b", border: "1px solid #c0392b", marginRight: "5px" }}>
                      hidden
                    </span>
                  )}
                  <a
                    href={flow.sourceUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-text-primary)", textDecoration: flow.sourceUrl ? "underline" : "none", textDecorationColor: "rgba(255,255,255,0.2)" }}
                  >
                    {flow.description}
                  </a>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
                    {flow.flowType ? (FLOW_TYPE_LABELS[flow.flowType] ?? flow.flowType) : "—"}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: flow.amountCents ? "var(--color-limestone)" : "var(--color-text-muted)" }}>
                  {flow.amountCents ? formatCents(flow.amountCents) : "unknown"}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {flow.isPublicCost && (
                      <span style={{ fontSize: "0.6rem", padding: "1px 4px", borderRadius: "3px", background: "rgba(192,57,43,0.15)", color: "#E87070", border: "1px solid rgba(192,57,43,0.3)" }}>
                        public cost
                      </span>
                    )}
                    {flow.isPrivateGain && (
                      <span style={{ fontSize: "0.6rem", padding: "1px 4px", borderRadius: "3px", background: "rgba(139,91,246,0.15)", color: "#B48FFF", border: "1px solid rgba(139,91,246,0.3)" }}>
                        private gain
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ ...tdStyle, fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
                  {flow.sourceTier}
                  {flow.sourceNote && <><br /><span style={{ fontStyle: "italic" }}>{flow.sourceNote.slice(0, 60)}{flow.sourceNote.length > 60 ? "…" : ""}</span></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "1rem" }}>
        Amounts in cents stored as integers to avoid float issues. Totals include only flows with known dollar amounts.
        RC = requires confirmation — treat running totals as minimums.
      </p>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  textAlign: "left",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "var(--color-text-muted)",
  fontFamily: "var(--font-sans)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "0.6rem 0.75rem",
  color: "var(--color-text-secondary)",
  verticalAlign: "top",
};
