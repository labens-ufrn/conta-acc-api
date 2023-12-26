import p from "pomme-ts";
import { z } from "zod";
import { studentReviewModel } from "./model-student-review";
import { reviewModel } from "./model-review-activity";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { activitiesModel } from "@src/modules/activities/model-activities";
import { activitiesOnCategoryModel } from "@src/modules/activities/model-activities-on-category";
import { getCurrentSemesterString } from "@src/core/utils/etc";

const bodySchema = z.object({
  activityId: z.string().default(""),
  name: z.string(),
  link: z.string().optional().nullable(),
  value: z.number().optional().nullable(),
});

export const v1RegisterActivity = p.route.post({
  key: "newActivity",
  bodySchema,
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw(["STUDENT"])],
  },
  path: "/activities",
  async resolver({ body }, ctx) {
    const { activityId, link, name, value } = body;
    const { studentId } = ctx;

    const reviewStudent = await studentReviewModel.findFirst({
      where: {
        studentId,
      },
    });

    if (!reviewStudent) {
      p.error.badRequest("Student not found");
    }

    if (reviewStudent.resolutionId === null) {
      p.error.badRequest("Student dont have resolution");
    }

    const activityFound = await activitiesModel.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!activityFound) {
      p.error.badRequest("Activity not found");
    }

    const activityOnCategory = await activitiesOnCategoryModel.findFirst({
      where: {
        activityId,
        category: {
          resolutionId: reviewStudent.resolutionId,
        },
      },
      include: {
        category: true,
      },
    });

    if (!activityOnCategory) {
      p.error.badRequest("Activity not found");
    }

    const activity = await reviewModel.create({
      data: {
        activityId,
        activityOnCategoryId: activityOnCategory.id,
        studentReviewId: reviewStudent.id,
        ...(value &&
          activityOnCategory.workloadInput && { inputPoints: value }),
        link,
        name,
        semester: getCurrentSemesterString(),
      },
    });

    return activity;
  },
});
