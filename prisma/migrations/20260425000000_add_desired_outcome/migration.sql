-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN "desiredId" TEXT;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_desiredId_fkey" FOREIGN KEY ("desiredId") REFERENCES "Option"("id") ON DELETE SET NULL ON UPDATE CASCADE;
