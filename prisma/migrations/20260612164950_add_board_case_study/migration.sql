-- CreateTable
CREATE TABLE "BoardCaseStudy" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "boardName" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "date" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT NOT NULL DEFAULT '',
    "stats" JSONB NOT NULL DEFAULT '[]',
    "principles" JSONB NOT NULL DEFAULT '[]',
    "ownership" JSONB NOT NULL DEFAULT '[]',
    "bottomLines" JSONB NOT NULL DEFAULT '[]',
    "sections" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "sources" JSONB NOT NULL DEFAULT '[]',
    "sourceUrls" JSONB NOT NULL DEFAULT '[]',
    "scoreTransparency" TEXT NOT NULL DEFAULT 'insufficient',
    "scoreConflicts" TEXT NOT NULL DEFAULT 'insufficient',
    "scoreMission" TEXT NOT NULL DEFAULT 'insufficient',
    "scoreDemocraticControl" TEXT NOT NULL DEFAULT 'insufficient',
    "scoreOversight" TEXT NOT NULL DEFAULT 'insufficient',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardCaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardCaseStudy_slug_key" ON "BoardCaseStudy"("slug");
