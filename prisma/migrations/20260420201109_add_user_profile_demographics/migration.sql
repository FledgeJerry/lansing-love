-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ageRange" TEXT,
ADD COLUMN     "attendsMeetings" TEXT,
ADD COLUMN     "emailSubscribed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "interests" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "raceEthnicity" TEXT,
ADD COLUMN     "ward" TEXT;
