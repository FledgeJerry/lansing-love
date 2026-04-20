import { Resend } from "resend";
import { prisma } from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "lansing.love <hello@lansing.love>";
const SITE = "https://lansing.love";

type QuestionSummary = {
  title: string;
  category?: string | null;
  sourceUrl?: string | null;
};

// Notify all ADMINs that a new question is pending review
export async function notifyAdminsPendingQuestion(question: QuestionSummary, submitterName: string) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  });
  if (!admins.length) return;

  await resend.emails.send({
    from: FROM,
    to: admins.map((a) => a.email),
    subject: `New question pending review — lansing.love`,
    html: `
      <p>A new prediction question was submitted by <strong>${submitterName}</strong> and is waiting for your review.</p>
      <blockquote style="border-left:3px solid #ccc;padding-left:1rem;margin:1rem 0;color:#333;">
        ${question.title}
      </blockquote>
      <p><a href="${SITE}/admin">Review in Admin →</a></p>
      <hr/>
      <p style="font-size:0.8rem;color:#999;">lansing.love — civic predictions for Lansing, MI</p>
    `,
  });
}

// Notify all subscribers when one question goes live
export async function notifySubscribersNewQuestion(question: QuestionSummary) {
  await notifySubscribersBatch([question]);
}

// Notify all subscribers of a batch of new questions (agenda import)
export async function notifySubscribersBatch(questions: QuestionSummary[]) {
  const subscribers = await prisma.user.findMany({
    where: { emailSubscribed: true },
    select: { email: true },
  });
  if (!subscribers.length || !questions.length) return;

  const isBatch = questions.length > 1;
  const subject = isBatch
    ? `${questions.length} new predictions added to lansing.love`
    : `New prediction: ${questions[0].title}`;

  const questionList = questions.map((q) => `
    <li style="margin-bottom:0.75rem;">
      <strong>${q.title}</strong>
      ${q.category ? `<span style="color:#888;font-size:0.85rem;"> — ${q.category}</span>` : ""}
      ${q.sourceUrl ? `<br/><a href="${q.sourceUrl}" style="font-size:0.85rem;">Learn more →</a>` : ""}
    </li>
  `).join("");

  const body = (email: string) => `
    <p>${isBatch ? "New prediction questions have been added" : "A new prediction question has been added"} to lansing.love:</p>
    <ul style="padding-left:1.25rem;">${questionList}</ul>
    <p><a href="${SITE}" style="background:#c0392b;color:#fff;padding:0.5rem 1rem;border-radius:4px;text-decoration:none;display:inline-block;">Go make your predictions →</a></p>
    <hr/>
    <p style="font-size:0.8rem;color:#999;">
      You're receiving this because you subscribed to lansing.love updates.<br/>
      <a href="${SITE}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#999;">Unsubscribe</a>
    </p>
  `;

  await Promise.all(
    subscribers.map((s) =>
      resend.emails.send({ from: FROM, to: s.email, subject, html: body(s.email) })
    )
  );
}
