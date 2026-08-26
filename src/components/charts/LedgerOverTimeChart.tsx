"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function formatDollars(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

type Flow = { flowDate: string | null; amountCents: string | null; isPublicCost: boolean; isPrivateGain: boolean };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LedgerOverTimeChart({ dollarFlows }: { dollarFlows: any[] }) {
  const data = useMemo(() => {
    const byYear = new Map<number, { publicCost: number; privateGain: number }>();
    (dollarFlows as Flow[]).forEach((f) => {
      if (!f.flowDate || !f.amountCents) return;
      const year = new Date(f.flowDate).getFullYear();
      const dollars = Number(f.amountCents) / 100;
      const entry = byYear.get(year) ?? { publicCost: 0, privateGain: 0 };
      if (f.isPublicCost) entry.publicCost += dollars;
      if (f.isPrivateGain) entry.privateGain += dollars;
      byYear.set(year, entry);
    });
    return Array.from(byYear.entries())
      .filter(([, v]) => v.publicCost > 0 || v.privateGain > 0)
      .sort(([a], [b]) => a - b)
      .map(([year, v]) => ({ year: String(year), ...v }));
  }, [dollarFlows]);

  if (data.length === 0) return null;

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
        Public cost and private gain, by year of the underlying transaction
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,241,232,0.08)" vertical={false} />
          <XAxis dataKey="year" tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} axisLine={{ stroke: "rgba(244,241,232,0.15)" }} tickLine={false} />
          <YAxis tickFormatter={formatDollars} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip
            formatter={(value, name) => [formatDollars(Number(value)), name === "publicCost" ? "Public cost" : "Private gain"]}
            labelStyle={{ color: "var(--color-limestone)" }}
            contentStyle={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-strong)", borderRadius: "6px", fontSize: "0.78rem" }}
          />
          <Legend
            formatter={(value) => (value === "publicCost" ? "Public cost" : "Private gain")}
            wrapperStyle={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}
          />
          <Bar dataKey="publicCost" fill="#E87070" radius={[3, 3, 0, 0]} />
          <Bar dataKey="privateGain" fill="#B48FFF" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
