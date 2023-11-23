-- AlterTable
ALTER TABLE "students" ADD COLUMN     "courseId" TEXT;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
