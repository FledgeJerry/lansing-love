import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const questions = await prisma.question.findMany({
    where: { status: { in: ["ACTIVE", "RESOLVED"] } },
    include: {
      options: {
        include: { _count: { select: { predictions: true } } },
      },
      _count: { select: { predictions: true } },
      outcome: { include: { option: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const userPredictions = session
    ? await prisma.prediction.findMany({
        where: { userId: session.user.id },
        select: { questionId: true, optionId: true },
      })
    : [];

  const predictionMap = Object.fromEntries(
    userPredictions.map((p: { questionId: string; optionId: string }) => [p.questionId, p.optionId])
  );

  const open = questions.filter((q) => q.status === "ACTIVE");
  const closed = questions.filter((q) => q.status !== "ACTIVE");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lansing Predictions</h1>
          <p className="text-gray-500 text-sm mt-1">
            What do you think will happen in our city?
          </p>
        </div>
        {session ? (
          <Link
            href="/submit"
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 text-sm"
          >
            Submit a question
          </Link>
        ) : (
          <Link href="/register" className="text-rose-600 text-sm hover:underline">
            Join to predict →
          </Link>
        )}
      </div>

      {open.length === 0 && closed.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No active predictions yet.</p>
      ) : (
        <>
          {open.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Open for voting
              </h2>
              <div className="space-y-4">
                {open.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    userPickId={predictionMap[q.id] ?? null}
                    isLoggedIn={!!session}
                  />
                ))}
              </div>
            </section>
          )}

          {closed.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Closed
              </h2>
              <div className="space-y-4">
                {closed.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    userPickId={predictionMap[q.id] ?? null}
                    isLoggedIn={!!session}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
