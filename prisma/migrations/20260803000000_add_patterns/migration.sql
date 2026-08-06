CREATE TABLE "Pattern" (
  "id"            TEXT NOT NULL,
  "slug"          TEXT NOT NULL,
  "number"        INTEGER NOT NULL,
  "name"          TEXT NOT NULL,
  "scale"         TEXT NOT NULL,
  "problem"       TEXT NOT NULL,
  "forces"        TEXT NOT NULL,
  "solution"      TEXT NOT NULL,
  "linksUp"       TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "linksDown"     TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "caseRefs"      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "externalLinks" JSONB NOT NULL DEFAULT '[]',
  "status"        TEXT NOT NULL DEFAULT 'tested',
  "published"     BOOLEAN NOT NULL DEFAULT true,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Pattern_slug_key" ON "Pattern"("slug");
