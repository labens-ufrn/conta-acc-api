/*
  Warnings:

  - You are about to drop the column `departamentId` on the `courses` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_departamentId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "departamentId",
ADD COLUMN     "departmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
