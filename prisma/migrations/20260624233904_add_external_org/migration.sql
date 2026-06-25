-- AlterTable
ALTER TABLE "AdvocacyEntry" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BoardMember" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "NeighborhoodOrg" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ExternalOrg" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "rawInput" TEXT NOT NULL,
    "notes" TEXT,
    "isCoop" BOOLEAN NOT NULL DEFAULT false,
    "isUnion" BOOLEAN NOT NULL DEFAULT false,
    "isWorkerOwned" BOOLEAN NOT NULL DEFAULT false,
    "offersLivingWage" BOOLEAN NOT NULL DEFAULT false,
    "ownsHousing" BOOLEAN NOT NULL DEFAULT false,
    "occupantCount" INTEGER,
    "employeeCount" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalOrg_pkey" PRIMARY KEY ("id")
);
