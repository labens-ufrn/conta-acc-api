import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { studentReviewModel } from "./model-student-review";
import { reviewModel } from "./model-review-activity";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { activitiesModel } from "@src/modules/activities/model-activities";
import { activitiesOnCategoryModel } from "@src/modules/activities/model-activities-on-category";

const bodySchema = z.object({
  activityId: z.string().default(""),
});

export const v1RegisterActivity = p.route.post({
  key: "registerActivity",
  bodySchema,
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw(["STUDENT"])],
  },
  path: "/me/review",
  async resolver({ body }, ctx) {
    const { activityId } = body;
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

    const activity = await reviewModel.create({
      data: {
        activityId,
        activityOnCategoryId: activityOnCategory.id,
        studentReviewId: reviewStudent.id,
      },
    });

    return activity;
  },
});
