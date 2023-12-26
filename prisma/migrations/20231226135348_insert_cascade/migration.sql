-- DropForeignKey
ALTER TABLE "activitiesOnCategories" DROP CONSTRAINT "activitiesOnCategories_activityId_fkey";

-- DropForeignKey
ALTER TABLE "activitiesOnCategories" DROP CONSTRAINT "activitiesOnCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_resolutionId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "resolutions" DROP CONSTRAINT "resolutions_courseId_fkey";

-- DropForeignKey
ALTER TABLE "reviewActivities" DROP CONSTRAINT "reviewActivities_activityId_fkey";

-- DropForeignKey
ALTER TABLE "reviewActivities" DROP CONSTRAINT "reviewActivities_activityOnCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "reviewActivities" DROP CONSTRAINT "reviewActivities_studentReviewId_fkey";

-- DropForeignKey
ALTER TABLE "studentReviews" DROP CONSTRAINT "studentReviews_resolutionId_fkey";

-- DropForeignKey
ALTER TABLE "studentReviews" DROP CONSTRAINT "studentReviews_studentId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_courseId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_courseId_fkey";

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resolutions" ADD CONSTRAINT "resolutions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_resolutionId_fkey" FOREIGN KEY ("resolutionId") REFERENCES "resolutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activitiesOnCategories" ADD CONSTRAINT "activitiesOnCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activitiesOnCategories" ADD CONSTRAINT "activitiesOnCategories_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentReviews" ADD CONSTRAINT "studentReviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentReviews" ADD CONSTRAINT "studentReviews_resolutionId_fkey" FOREIGN KEY ("resolutionId") REFERENCES "resolutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewActivities" ADD CONSTRAINT "reviewActivities_studentReviewId_fkey" FOREIGN KEY ("studentReviewId") REFERENCES "studentReviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewActivities" ADD CONSTRAINT "reviewActivities_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewActivities" ADD CONSTRAINT "reviewActivities_activityOnCategoryId_fkey" FOREIGN KEY ("activityOnCategoryId") REFERENCES "activitiesOnCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
