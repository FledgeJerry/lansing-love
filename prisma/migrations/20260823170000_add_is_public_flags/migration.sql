-- AlterTable
ALTER TABLE "entities" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "dollar_flows" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;
