import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    let transcriptText = "";
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      const text = form.get("text") as string | null;

      if (text) {
        transcriptText = text;
      } else if (file) {
        if (file.type === "application/pdf") {
          const { extractText } = await import("unpdf");
          const buffer = new Uint8Array(await file.arrayBuffer());
          const { text: extracted } = await extractText(buffer, { mergePages: true });
          transcriptText = extracted;
        } else {
          transcriptText = await file.text();
        }
      }
    } else {
      const body = await req.json();
      transcriptText = body.text ?? "";
    }

    if (!transcriptText.trim()) {
      return NextResponse.json({ error: "No transcript content provided" }, { status: 400 });
    }

    // Fetch all questions that need resolving
    const now = new Date();
    const allActive = await prisma.question.findMany({
      where: {
        status: { in: ["CLOSED", "ACTIVE"] },
        outcome: null,
      },
      include: { options: true },
    });
    const questions = allActive.filter(
      (q) => q.status === "CLOSED" || (q.closeAt && q.closeAt < now)
    );

    if (questions.length === 0) {
      return NextResponse.json({ error: "No questions are currently awaiting resolution." }, { status: 400 });
    }

    const questionList = questions.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      options: q.options.map((o) => ({ id: o.id, label: o.label })),
    }));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are helping resolve prediction questions for a civic prediction website about Lansing, Michigan city council meetings.

Below is a list of open prediction questions with their possible answer options. Each question and option has an ID.

Then below that is the full transcript of the city council meeting. Read the transcript carefully and determine which answer option was the actual outcome for each question.

For each question:
- If the outcome is clearly stated in the transcript, set confidence to "high"
- If it can be reasonably inferred but not explicitly stated, set confidence to "medium"
- If you cannot determine the outcome from the transcript, omit the question from your resolutions

Return ONLY valid JSON, no markdown, no explanation:
{
  "resolutions": [
    {
      "questionId": "...",
      "optionId": "...",
      "confidence": "high" | "medium" | "low",
      "reasoning": "One sentence explaining what in the transcript supports this outcome."
    }
  ]
}

QUESTIONS:
${JSON.stringify(questionList, null, 2)}

TRANSCRIPT:
${transcriptText}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let parsed: { resolutions: { questionId: string; optionId: string; confidence: string; reasoning: string }[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        return NextResponse.json({ error: "Failed to parse AI response", raw }, { status: 500 });
      }
    }

    // Attach question/option details for the UI
    const resolutionsWithDetails = parsed.resolutions
      .map((r) => {
        const q = questions.find((q) => q.id === r.questionId);
        const o = q?.options.find((o) => o.id === r.optionId);
        if (!q || !o) return null;
        return {
          questionId: r.questionId,
          questionTitle: q.title,
          questionCategory: q.category,
          optionId: r.optionId,
          optionLabel: o.label,
          allOptions: q.options,
          confidence: r.confidence,
          reasoning: r.reasoning,
        };
      })
      .filter(Boolean);

    // Questions Gemini couldn't resolve
    const resolvedIds = new Set(parsed.resolutions.map((r) => r.questionId));
    const unresolved = questions
      .filter((q) => !resolvedIds.has(q.id))
      .map((q) => ({
        questionId: q.id,
        questionTitle: q.title,
        questionCategory: q.category,
        allOptions: q.options,
      }));

    return NextResponse.json({ resolutions: resolutionsWithDetails, unresolved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
