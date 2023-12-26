import p from "pomme-ts";

import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { reviewModel } from "./model-review-activity";
import { studentModel } from "../model-student";
import { courseModel } from "@src/modules/course/model-course";

export const v1DeleteActivityStudent = p.route.delete({
  key: "deleteActivityStudent",
  path: "/:id",
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw(["STUDENT", "COORDINATOR"])],
  },
  async resolver(input, ctx) {
    const { id } = input.params;

    let studentId = undefined;

    const { courseId, user } = ctx;

    if (user.role === "STUDENT") {
      studentId = ctx.studentId;
    } else if (user.role === "COORDINATOR") {
      const review = await reviewModel.findFirst({
        where: {
          id,
          studentReview: {
            student: {
              courseId,
            },
          },
        },
      });

      if (!review) {
        p.error.badRequest("Review not found");
      }
    }

    const courseFound = await courseModel.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!courseFound) {
      p.error.badRequest("Course not found");
    }

    const studentFound = await studentModel.findUnique({
      where: {
        id,
        courseId,
      },
    });

    if (!studentFound) {
      p.error.badRequest("Student not found");
    }

    const reviewFound = await reviewModel.findFirst({
      where: {
        id,
      },
    });

    if (!reviewFound) {
      p.error.badRequest("Review not found");
    }

    const review = await reviewModel.delete({
      where: {
        id,
      },
    });

    return review;
  },
});
