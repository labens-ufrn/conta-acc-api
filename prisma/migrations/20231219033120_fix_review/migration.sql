-- DropForeignKey
ALTER TABLE "studentReviews" DROP CONSTRAINT "studentReviews_resolutionId_fkey";

-- AlterTable
ALTER TABLE "studentReviews" ALTER COLUMN "resolutionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "studentReviews" ADD CONSTRAINT "studentReviews_resolutionId_fkey" FOREIGN KEY ("resolutionId") REFERENCES "resolutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
