-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "maxPoints" INTEGER,
ADD COLUMN     "minPoints" INTEGER;

-- AlterTable
ALTER TABLE "reviewActivities" ADD COLUMN     "name" TEXT;
