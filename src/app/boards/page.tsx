import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lansing Boards & Commissions",
  description: "Directory of all City of Lansing appointed boards and commissions — members, terms, vacancies, and expired seats. Source: City of Lansing, March 2026.",
  alternates: { canonical: "/boards" },
};

const STATUS_COLOR: Record<string, string> = {
  current:  "var(--color-steel-muted)",
  expired:  "#c0392b",
  vacant:   "#E8C84A",
  proposed: "var(--color-teal-accent)",
};

const STATUS_LABEL: Record<string, string> = {
  current:  "Current",
  expired:  "Expired",
  vacant:   "Vacant",
  proposed: "Proposed",
};

export default async function BoardsPage() {
  const boards = await prisma.board.findMany({
    orderBy: { sortOrder: "asc" },
    include: { members: { orderBy: { sortOrder: "asc" } } },
  });

  const totalMembers = boards.reduce((s, b) => s + b.members.length, 0);
  const totalExpired = boards.reduce((s, b) => s + b.members.filter(m => m.status === "expired").length, 0);
  const totalVacant  = boards.reduce((s, b) => s + b.members.filter(m => m.status === "vacant").length, 0);
  const flaggedBoards = boards.filter(b => b.notes?.startsWith("ACCOUNTABILITY FLAG"));

  return (
    <div style={{ maxWidth: "960px", paddingBottom: "5rem" }}>

      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/governance" style={{ color: "var(--color-steel-muted)" }}>Governance</Link>
        <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>→</span>
        Boards &amp; Commissions
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow">Lansing Appointed Boards &amp; Commissions</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", marginBottom: "0.75rem" }}>
          {boards.length} boards · {totalMembers} seats
        </h1>
        <p style={{ maxWidth: "640px", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>
          Every member is appointed by the Mayor unless otherwise noted. No elected seats exist on any of these boards.
          Source: City of Lansing official roster, updated March 12, 2026.
        </p>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {[
            { label: "Total seats", value: totalMembers, color: "var(--color-limestone)" },
            { label: "Expired terms", value: totalExpired, color: "#c0392b" },
            { label: "Vacant seats", value: totalVacant,  color: "#E8C84A" },
            { label: "Boards flagged", value: flaggedBoards.length, color: "var(--color-dome-gold)" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color, lineHeight: 1, margin: 0 }}>{value}</p>
              <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-steel-muted)", margin: "0.2rem 0 0" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accountability flags */}
      {flaggedBoards.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#c0392b", marginBottom: "0.75rem" }}>Accountability flags</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {flaggedBoards.map(b => {
              const expired = b.members.filter(m => m.status === "expired");
              return (
                <div key={b.id} style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "8px", padding: "0.875rem 1rem" }}>
                  <p style={{ fontWeight: 600, color: "var(--color-limestone)", margin: 0, fontSize: "0.875rem" }}>
                    {b.name}
                    {expired.length > 0 && (
                      <span style={{ marginLeft: "0.5rem", fontSize: "0.68rem", color: "#c0392b", fontWeight: 700 }}>
                        {expired.length} expired term{expired.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--color-steel-muted)", margin: "0.2rem 0 0" }}>
                    {b.notes?.replace("ACCOUNTABILITY FLAG: ", "")}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <hr className="divider" />

      {/* Full directory */}
      <section>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-steel-muted)", marginBottom: "1rem" }}>All boards</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {boards.map(board => {
            const expired = board.members.filter(m => m.status === "expired").length;
            const vacant  = board.members.filter(m => m.status === "vacant").length;
            const isFlag  = board.notes?.startsWith("ACCOUNTABILITY FLAG");

            return (
              <div key={board.id} style={{ borderLeft: `3px solid ${isFlag ? "rgba(192,57,43,0.5)" : "rgba(244,241,232,0.08)"}`, paddingLeft: "1rem" }}>
                {/* Board header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--color-limestone)", margin: 0, fontSize: "0.9rem" }}>{board.name}</p>
                    {board.notes && !isFlag && (
                      <p style={{ fontSize: "0.72rem", color: "var(--color-steel-muted)", margin: "0.15rem 0 0" }}>{board.notes}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, alignItems: "center" }}>
                    {expired > 0 && <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c0392b" }}>{expired} expired</span>}
                    {vacant > 0  && <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#E8C84A" }}>{vacant} vacant</span>}
                    <span style={{ fontSize: "0.68rem", color: "rgba(154,176,200,0.4)" }}>{board.members.length} seats</span>
                  </div>
                </div>

                {/* Members */}
                {board.members.length > 0 && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                      <tbody>
                        {board.members.map(mem => (
                          <tr key={mem.id} style={{ borderBottom: "1px solid rgba(244,241,232,0.04)" }}>
                            <td style={{ padding: "0.35rem 0.5rem 0.35rem 0", minWidth: "180px" }}>
                              <span style={{ color: mem.status === "vacant" ? "#E8C84A" : mem.status === "expired" ? "#c0392b" : "var(--color-limestone)", fontWeight: mem.status === "current" ? 400 : 600 }}>
                                {mem.name}
                              </span>
                            </td>
                            <td style={{ padding: "0.35rem 0.75rem", color: "var(--color-text-muted)", fontSize: "0.72rem", whiteSpace: "nowrap" }}>{mem.role ?? "—"}</td>
                            <td style={{ padding: "0.35rem 0.75rem", whiteSpace: "nowrap" }}>
                              {mem.termExpires && mem.termExpires !== "—" ? (
                                <span style={{ fontSize: "0.72rem", color: STATUS_COLOR[mem.status] ?? "var(--color-steel-muted)" }}>
                                  {mem.termExpires === "ex officio" ? "ex officio" : mem.termExpires}
                                  {mem.status === "expired" && " ⚠"}
                                </span>
                              ) : (
                                <span style={{ fontSize: "0.68rem", color: "rgba(154,176,200,0.3)" }}>—</span>
                              )}
                            </td>
                            {mem.notes && (
                              <td style={{ padding: "0.35rem 0.75rem", fontSize: "0.68rem", color: "rgba(154,176,200,0.6)", maxWidth: "280px" }}>
                                {mem.notes.split(".")[0]}.
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {board.members.length === 0 && (
                  <p style={{ fontSize: "0.75rem", color: "rgba(154,176,200,0.4)", margin: "0.25rem 0 0" }}>Contact DNCE for current roster: (517) 483-4141</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", borderTop: "1px solid rgba(244,241,232,0.08)", paddingTop: "1.5rem", marginTop: "2rem" }}>
        <Link href="/governance" className="btn btn--ghost btn--sm">← Governance</Link>
        <Link href="/governance/issues" className="btn btn--ghost btn--sm">Board case studies →</Link>
        <Link href="/neighborhoods" className="btn btn--ghost btn--sm">Neighborhood orgs →</Link>
      </div>

      <p style={{ fontSize: "0.72rem", color: "rgba(154,176,200,0.5)", marginTop: "1rem", maxWidth: "580px" }}>
        Source: City of Lansing official Boards and Commissions roster, updated March 12, 2026.
        Only City of Lansing appointees are listed; some external boards have additional members appointed by other authorities.
      </p>
    </div>
  );
}
