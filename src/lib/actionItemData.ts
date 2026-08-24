export function buildActionItemData(body: Record<string, unknown>) {
  return {
    title: body.title as string,
    description: (body.description as string) || null,
    status: (body.status as string) ?? "open",
    horizon: (body.horizon as string) || null,
    subjects: (body.subjects as string[]) ?? [],
    dueDate: body.dueDate ? new Date(body.dueDate as string) : null,
    responsible: (body.responsible as string) || null,
    sourceType: (body.sourceType as string) || null,
    sourceSlug: (body.sourceSlug as string) || null,
    sourcePhase: (body.sourcePhase as string) || null,
    closedAt: body.status === "done" ? (body.closedAt ? new Date(body.closedAt as string) : new Date()) : null,
    closedNote: (body.closedNote as string) || null,
    sortOrder: (body.sortOrder as number) ?? 0,
  };
}
