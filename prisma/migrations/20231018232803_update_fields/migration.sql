/*
  Warnings:

  - You are about to drop the column `domainId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_domainId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "domainId",
ADD COLUMN     "courseId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
