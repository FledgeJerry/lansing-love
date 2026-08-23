export function buildDollarFlowData(body: Record<string, unknown>) {
  return {
    description: body.description as string,
    flowType: (body.flowType as string) || null,
    amountCents: body.amountCents != null ? BigInt(body.amountCents as number) : null,
    fromEntityId: body.fromEntityId != null ? Number(body.fromEntityId) : null,
    toEntityId: body.toEntityId != null ? Number(body.toEntityId) : null,
    eventId: body.eventId != null ? Number(body.eventId) : null,
    flowDate: body.flowDate ? new Date(body.flowDate as string) : null,
    flowDateEnd: body.flowDateEnd ? new Date(body.flowDateEnd as string) : null,
    isPublicCost: (body.isPublicCost as boolean) ?? false,
    isPrivateGain: (body.isPrivateGain as boolean) ?? false,
    sourceTier: (body.sourceTier as string) ?? "RC",
    sourceNote: (body.sourceNote as string) || null,
    sourceUrl: (body.sourceUrl as string) || null,
    isPublic: (body.isPublic as boolean) ?? true,
  };
}
