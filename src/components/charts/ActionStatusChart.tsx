"use client";

import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ACTION_STATUSES, ACTION_STATUS_LABELS, ACTION_STATUS_COLORS } from "@/lib/actionItemTypes";

type Action = { status: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ActionStatusChart({ actions }: { actions: any[] }) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    (actions as Action[]).forEach((a) => counts.set(a.status, (counts.get(a.status) ?? 0) + 1));
    return ACTION_STATUSES
      .map((s) => ({ status: s, label: ACTION_STATUS_LABELS[s], value: counts.get(s) ?? 0, color: ACTION_STATUS_COLORS[s] }))
      .filter((d) => d.value > 0);
  }, [actions]);

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
          {data.map((d) => <Cell key={d.status} fill={d.color} />)}
        </Pie>
        <Tooltip
          contentStyle={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-strong)", borderRadius: "6px", fontSize: "0.78rem" }}
          labelStyle={{ color: "var(--color-limestone)" }}
        />
        <Legend wrapperStyle={{ fontSize: "0.72rem", color: "var(--color-text-secondary)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
