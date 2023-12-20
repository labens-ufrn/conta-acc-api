/*
  Warnings:

  - Added the required column `activityOnCategoryId` to the `reviewActivities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviewActivities" ADD COLUMN     "activityOnCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "reviewActivities" ADD CONSTRAINT "reviewActivities_activityOnCategoryId_fkey" FOREIGN KEY ("activityOnCategoryId") REFERENCES "activitiesOnCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
