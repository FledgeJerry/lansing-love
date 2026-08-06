import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { DEFAULT_ASKLANSING_PROMPT } from "@/lib/asklansing-default-prompt";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSystemPrompt(base: string, cases: any[], patterns: any[], boards: any[], predictions: any[], adminNotes: { userMessage: string; adminNote: string }[], communityKnowledge: string) {
  const casesContext = cases.length
    ? cases.map((c) => {
        const stats = (c.stats as { value: string; label: string }[] | null)?.[0];
        return `- **${c.boardName}** (${c.category}, ${c.date}): ${c.summary}${stats ? ` Key stat: ${stats.value} ${stats.label}.` : ""} Scores: transparency=${c.scoreTransparency}, conflicts=${c.scoreConflicts}, mission=${c.scoreMission}, democratic-control=${c.scoreDemocraticControl}, oversight=${c.scoreOversight}. Players: ${(c.players as string[]).slice(0, 4).join(", ")}. → /governance/issues/${c.slug}`;
      }).join("\n")
    : "No cases loaded.";

  const patternsContext = patterns.length
    ? patterns.map((p) => `- **Pattern ${p.number}: ${p.name}** (${p.scale} scale): ${p.problem.slice(0, 120)}… Solution: ${p.solution.slice(0, 120)}…${p.caseRefs?.length ? ` Evidenced by: ${(p.caseRefs as string[]).join(", ")}.` : ""} → /patterns/${p.slug}`)
        .join("\n")
    : "No patterns loaded.";

  const boardsContext = boards.length
    ? boards.map((b) => `- **${b.name}**${b.notes ? `: ${b.notes}` : ""}`).join("\n")
    : "No boards loaded.";

  const predictionsContext = predictions.length
    ? predictions.map((p) => `- "${p.title}"${p.category ? ` [${p.category}]` : ""} — status: ${p.status}`).join("\n")
    : "No active predictions.";

  return `${base}

## Full Accounting Cases
${casesContext}

## Pattern Language (28 patterns)
${patternsContext}

## Lansing Boards & Commissions
${boardsContext}

## Active Civic Predictions
${predictionsContext}

${communityKnowledge ? `## Community Knowledge (verified by lansing.love team)
${communityKnowledge}` : ""}

${adminNotes.length > 0 ? `## Verified Answers (use these — they override "I don't know")
The lansing.love team has verified the following answers. When a user asks about these topics, use this information directly rather than saying you don't have it:
${adminNotes.map((n) => `- Question/topic: "${n.userMessage}"\n  Verified answer: ${n.adminNote}`).join("\n\n")}` : ""}`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const [cases, patterns, boards, predictions, rawNotes, promptConfig, communityKnowledgeConfig] = await Promise.all([
      prisma.boardCaseStudy.findMany({
        where: { published: true },
        orderBy: { createdAt: "asc" },
        select: { slug: true, boardName: true, category: true, date: true, summary: true, stats: true, players: true, scoreTransparency: true, scoreConflicts: true, scoreMission: true, scoreDemocraticControl: true, scoreOversight: true },
      }),
      prisma.pattern.findMany({
        where: { published: true },
        orderBy: { number: "asc" },
        select: { slug: true, number: true, name: true, scale: true, problem: true, solution: true, caseRefs: true },
      }),
      prisma.board.findMany({
        orderBy: { name: "asc" },
        select: { name: true, notes: true },
      }),
      prisma.question.findMany({
        where: { status: { in: ["ACTIVE", "CLOSED", "RESOLVED"] } },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { title: true, category: true, status: true },
      }),
      prisma.chatLog.findMany({
        where: { adminNote: { not: null }, promoted: false },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { userMessage: true, adminNote: true },
      }),
      prisma.siteConfig.findUnique({ where: { key: "asklansing_prompt" } }),
      prisma.siteConfig.findUnique({ where: { key: "asklansing_community_knowledge" } }),
    ]);

    const customAdditions = promptConfig?.value ?? "";
    const base = customAdditions
      ? `${DEFAULT_ASKLANSING_PROMPT}\n\n## Custom Knowledge & Overrides\n${customAdditions}`
      : DEFAULT_ASKLANSING_PROMPT;
    const adminNotes = rawNotes.map((n) => ({ userMessage: n.userMessage, adminNote: n.adminNote! }));
    const communityKnowledge = communityKnowledgeConfig?.value ?? "";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: buildSystemPrompt(base, cases, patterns, boards, predictions, adminNotes, communityKnowledge),
    });

    const allHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const firstUserIdx = allHistory.findIndex((m: { role: string }) => m.role === "user");
    const history = firstUserIdx >= 0 ? allHistory.slice(firstUserIdx) : [];

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const responseText = result.response.text();

    const GAP_PHRASES = ["i don't know", "i'm not sure", "not sure", "i'm not aware", "i don't have", "i cannot find", "i can't find", "i have no information", "no information available"];
    const flagged = GAP_PHRASES.some((p) => responseText.toLowerCase().includes(p));

    prisma.chatLog.create({
      data: { userMessage: lastMessage.content, botResponse: responseText, flagged },
    }).catch(() => {});

    return NextResponse.json({ content: responseText });
  } catch (err) {
    console.error("[ask-lansing]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
