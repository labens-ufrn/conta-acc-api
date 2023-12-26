import p from "pomme-ts";
import { z } from "zod";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { reviewModel } from "./model-review-activity";
import { studentReviewModel } from "./model-student-review";
import { studentModel } from "../model-student";

const bodySchema = z.object({
  name: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  status: z.enum(["APPROVED", "REJECTED"]).optional().nullable(),
});

export const v1UpdateReview = p.route.put({
  key: "updateReview",
  path: "/activities/:reviewActivityId",
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw(["STUDENT", "COORDINATOR"])],
  },
  bodySchema,
  async resolver({ body, params }, ctx) {
    const { link, name, status } = body;
    const { reviewActivityId } = params;
    const { studentId, user } = ctx;

    const reviewActivity = await reviewModel.findUnique({
      where: {
        id: reviewActivityId,
      },
    });

    if (!reviewActivity) {
      p.error.badRequest("Review not found");
    }

    if (user.role === "STUDENT") {
      if (status) {
        p.error.badRequest("Status not allowed");
      }
      const studentReview = await studentReviewModel.findFirst({
        where: {
          studentId,
        },
      });

      if (!studentReview) {
        p.error.badRequest("Student Review not found");
      }

      if (reviewActivity.studentReviewId !== studentReview.id) {
        p.error.badRequest("Review not found");
      }
    } else if (user.role === "COORDINATOR") {
      const student = await studentModel.findFirst({
        where: {
          id: studentId,
          courseId: ctx.courseId,
        },
      });

      if (!student) {
        p.error.badRequest("Student not found");
      }
    }

    const activity = await reviewModel.update({
      where: {
        id: reviewActivityId,
      },
      data: {
        link,
        name,
        status: status as any,
      },
    });

    return activity;
  },
});
