import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    let agendaText = "";
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      const text = form.get("text") as string | null;

      if (text) {
        agendaText = text;
      } else if (file) {
        if (file.type === "application/pdf") {
          const { extractText } = await import("unpdf");
          const buffer = new Uint8Array(await file.arrayBuffer());
          const { text } = await extractText(buffer, { mergePages: true });
          agendaText = text;
        } else {
          agendaText = await file.text();
        }
      }
    } else {
      const body = await req.json();
      agendaText = body.text ?? "";
    }

    if (!agendaText.trim()) {
      return NextResponse.json({ error: "No agenda content provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are helping run a civic prediction website for Lansing, Michigan.

Given the following city council agenda, extract every actionable item that has an uncertain outcome and could be turned into a prediction question for the public to vote on.

For each item, produce:
- A clear, concise question (e.g. "Will the rezoning of 123 Main St be approved?")
- 2-4 answer options that cover the realistic outcomes (e.g. "Approved", "Denied", "Tabled", "Amended and approved")
- A short description with context (1-2 sentences max)
- A category (e.g. "Zoning", "Budget", "Elections", "Transit", "Housing", "Public Safety")

Skip purely administrative items (minutes approval, roll call, adjournment, etc.) that have no uncertain outcome.

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{
  "questions": [
    {
      "title": "...",
      "description": "...",
      "category": "...",
      "options": ["...", "..."]
    }
  ]
}

AGENDA:
${agendaText}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let parsed: { questions: { title: string; description: string; category: string; options: string[] }[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        return NextResponse.json({ error: "Failed to parse Gemini response", raw }, { status: 500 });
      }
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
