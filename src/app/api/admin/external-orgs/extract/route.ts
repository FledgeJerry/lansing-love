import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPT = `You are extracting a co-op/union/employer listing for a Lansing, MI civic directory from whatever
text was pasted — an email, a website's About page, raw notes, anything.

Text:
{TEXT}

Return ONLY valid JSON (no markdown, no explanation) matching this exact structure:

{
  "name": "Organization's name",
  "website": "https://... or null if not mentioned",
  "email": "contact email or null if not mentioned",
  "phone": "contact phone or null if not mentioned",
  "isCoop": true or false — is this a cooperative (worker, consumer, or housing co-op)?,
  "isUnion": true or false — is this a labor union or unionized workplace?,
  "isWorkerOwned": true or false — is it specifically worker-owned (employees are the owners)?,
  "offersLivingWage": true or false — does the text claim/imply living-wage pay? Only true if there's actual evidence, not just "fair pay" marketing language.,
  "ownsHousing": true or false — does this org own/operate housing (e.g. a housing co-op, co-housing project)?,
  "occupantCount": number of people housed if mentioned and ownsHousing is true, otherwise null,
  "employeeCount": number of employees/members if mentioned, otherwise null,
  "notes": "1-3 sentence plain-language summary of what this org is and does, suitable for public display"
}

If the text doesn't give enough information for a field, use null or false (for booleans) rather than guessing.`;

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { text } = await req.json() as { text?: string };
  if (!text?.trim()) return NextResponse.json({ error: "No text provided" }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent(PROMPT.replace("{TEXT}", text.slice(0, 8000)));
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const data = JSON.parse(cleaned);
    return NextResponse.json(data);
  } catch (err) {
    console.error("External org extract error:", err);
    return NextResponse.json({ error: "AI extraction failed — check logs, or fill in the form manually" }, { status: 500 });
  }
}
