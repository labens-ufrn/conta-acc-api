/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `studentReviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "studentReviews_studentId_key" ON "studentReviews"("studentId");
