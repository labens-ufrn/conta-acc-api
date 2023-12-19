-- CreateTable
CREATE TABLE "studentReviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metaData" JSONB,
    "studentId" TEXT NOT NULL,
    "resolutionId" TEXT NOT NULL,

    CONSTRAINT "studentReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviewActivities" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metaData" JSONB,
    "studentReviewId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "reviewActivities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "studentReviews" ADD CONSTRAINT "studentReviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentReviews" ADD CONSTRAINT "studentReviews_resolutionId_fkey" FOREIGN KEY ("resolutionId") REFERENCES "resolutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewActivities" ADD CONSTRAINT "reviewActivities_studentReviewId_fkey" FOREIGN KEY ("studentReviewId") REFERENCES "studentReviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewActivities" ADD CONSTRAINT "reviewActivities_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
