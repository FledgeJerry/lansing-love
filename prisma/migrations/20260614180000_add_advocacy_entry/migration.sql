CREATE TABLE "AdvocacyEntry" (
    "id" TEXT NOT NULL,
    "entryType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detail" TEXT,
    "who" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdvocacyEntry_pkey" PRIMARY KEY ("id")
);
