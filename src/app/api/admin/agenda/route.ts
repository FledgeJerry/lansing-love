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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are helping run a civic prediction website for Lansing, Michigan.

Given the following city council agenda, extract every actionable item that has an uncertain outcome and could be turned into a prediction question for the public to vote on.

For each item, produce:
- A clear, concise question (e.g. "Will the rezoning of 123 Main St be approved?")
- 2-4 answer options that cover the realistic outcomes (e.g. "Approved", "Denied", "Tabled", "Amended and approved")
- A short description with context (1-2 sentences max)
- A category (e.g. "Zoning", "Budget", "Elections", "Transit", "Housing", "Public Safety")
- A sourceUrl if a URL is explicitly mentioned in the agenda text for this item (e.g. a link to a document, report, or agenda packet). Leave as null if none is present — do not guess or fabricate URLs.
- A sourceText identifying the agenda item number and meeting this came from (e.g. "Agenda Item #7 — Lansing City Council Meeting, April 15, 2026"). Extract the meeting date and body name from the agenda header. If no item number is present, use the section heading. Never leave this null if you can identify the meeting.
- A meetingStart datetime when the meeting is scheduled to begin, extracted from the agenda header (e.g. "2026-04-21T07:00:00"). Use ISO 8601 format. This is the time predictions should close — people should not be able to predict after the meeting starts. If no time is listed, default to 07:00:00 PM local time (19:00:00). If no date can be found, leave as null.

Skip purely administrative items (minutes approval, roll call, adjournment, etc.) that have no uncertain outcome.

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{
  "meetingStart": "2026-04-21T19:00:00" or null,
  "questions": [
    {
      "title": "...",
      "description": "...",
      "category": "...",
      "options": ["...", "..."],
      "sourceUrl": "..." or null,
      "sourceText": "..." or null
    }
  ]
}

AGENDA:
${agendaText}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let parsed: { meetingStart?: string | null; questions: { title: string; description: string; category: string; options: string[]; sourceUrl?: string | null; sourceText?: string | null }[] };
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
