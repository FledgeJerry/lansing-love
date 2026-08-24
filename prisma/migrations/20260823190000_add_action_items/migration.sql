CREATE TABLE "ActionItem" (
  "id"          TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "status"      TEXT NOT NULL DEFAULT 'open',
  "horizon"     TEXT,
  "subjects"    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "dueDate"     TIMESTAMP(3),
  "responsible" TEXT,
  "sourceType"  TEXT,
  "sourceSlug"  TEXT,
  "sourcePhase" TEXT,
  "closedAt"    TIMESTAMP(3),
  "closedNote"  TEXT,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActionItem_pkey" PRIMARY KEY ("id")
);
