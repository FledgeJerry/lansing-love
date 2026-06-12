import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRINCIPLE_NAMES, OWNERSHIP_QUESTIONS, BOTTOM_LINE_DIMENSIONS } from "@/lib/caseStudyTypes";

const PROMPT = `You are analyzing a Rhinoceros Media article about a Lansing government board or commission.
Your task: apply a cooperative accountability framework and return structured JSON.

Article text:
{TEXT}

Return ONLY valid JSON (no markdown, no explanation) matching this exact structure:

{
  "boardName": "Full official name of the board or commission",
  "category": "One of: Housing, Surveillance, Ethics, Land Use, Finance, Public Safety, Environment, Other",
  "date": "Month Year e.g. June 2026",
  "slug": "kebab-case-url-slug",
  "summary": "2-3 sentences describing the accountability failure. Factual and specific.",
  "stats": [
    {"value": "specific number or dollar amount from article", "label": "short description"},
    ... up to 8 items using specific numbers from the article
  ],
  "principles": [
    {
      "num": 1,
      "name": "${PRINCIPLE_NAMES[0]}",
      "violation": "How this board violates this principle (2-3 sentences). If evidence is thin, say so honestly.",
      "evidence": "Specific evidence cited in the article (1 sentence). Quote data."
    },
    {"num": 2, "name": "${PRINCIPLE_NAMES[1]}", "violation": "...", "evidence": "..."},
    {"num": 3, "name": "${PRINCIPLE_NAMES[2]}", "violation": "...", "evidence": "..."},
    {"num": 4, "name": "${PRINCIPLE_NAMES[3]}", "violation": "...", "evidence": "..."},
    {"num": 5, "name": "${PRINCIPLE_NAMES[4]}", "violation": "...", "evidence": "..."},
    {"num": 6, "name": "${PRINCIPLE_NAMES[5]}", "violation": "...", "evidence": "..."},
    {"num": 7, "name": "${PRINCIPLE_NAMES[6]}", "violation": "...", "evidence": "..."}
  ],
  "ownership": [
    {"question": "${OWNERSHIP_QUESTIONS[0]}", "before": "Who controlled this before", "after": "Who controls it now", "assessment": "extractive"},
    {"question": "${OWNERSHIP_QUESTIONS[1]}", "before": "...", "after": "...", "assessment": "extractive"},
    {"question": "${OWNERSHIP_QUESTIONS[2]}", "before": "...", "after": "...", "assessment": "extractive"},
    {"question": "${OWNERSHIP_QUESTIONS[3]}", "before": "...", "after": "...", "assessment": "extractive"},
    {"question": "${OWNERSHIP_QUESTIONS[4]}", "before": "...", "after": "...", "assessment": "extractive"}
  ],
  "bottomLines": [
    {"dimension": "${BOTTOM_LINE_DIMENSIONS[0]}", "impact": "negative", "description": "Community impact 1-2 sentences"},
    {"dimension": "${BOTTOM_LINE_DIMENSIONS[1]}", "impact": "negative", "description": "..."},
    {"dimension": "${BOTTOM_LINE_DIMENSIONS[2]}", "impact": "negative", "description": "..."},
    {"dimension": "${BOTTOM_LINE_DIMENSIONS[3]}", "impact": "negative", "description": "..."}
  ],
  "scoreTransparency": "high-risk",
  "scoreConflicts": "high-risk",
  "scoreMission": "high-risk",
  "scoreDemocraticControl": "high-risk",
  "scoreOversight": "high-risk",
  "sections": [
    {
      "eyebrow": "short eyebrow label",
      "heading": "Section heading",
      "description": "Optional intro sentence",
      "items": [
        {"label": "Item title", "desc": "Item description 2-3 sentences"},
        ...
      ]
    },
    ... 3-5 sections covering key documented findings
  ],
  "recommendations": [
    "Specific actionable recommendation",
    ... 4-6 recommendations
  ],
  "sources": [
    "Source citation from the article",
    ...
  ]
}

Assessment values must be exactly: "extractive", "mixed", or "non-extractive"
Impact values must be exactly: "positive", "negative", or "mixed"
Score values must be exactly: "high-risk", "concerning", "ok", or "insufficient"
Use "insufficient" only when the article provides no evidence for that dimension.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { urls } = await req.json() as { urls: string[] };
  if (!urls?.length) return NextResponse.json({ error: "No URLs provided" }, { status: 400 });

  // Fetch article text from all provided URLs
  const texts: string[] = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "lansing.love governance research" } });
      if (!res.ok) continue;
      const html = await res.text();
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 15000);
      texts.push(`URL: ${url}\n\n${text}`);
    } catch { /* skip failed URLs */ }
  }

  if (!texts.length) return NextResponse.json({ error: "Could not fetch any articles" }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = PROMPT.replace("{TEXT}", texts.join("\n\n---\n\n"));

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const data = JSON.parse(cleaned);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Gemini analyze error:", err);
    return NextResponse.json({ error: "AI analysis failed — check logs" }, { status: 500 });
  }
}
