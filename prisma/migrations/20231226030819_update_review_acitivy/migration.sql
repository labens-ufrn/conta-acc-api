-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('INPROGRESS', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "reviewActivities" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'INPROGRESS';

-- AlterTable
ALTER TABLE "studentReviews" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
