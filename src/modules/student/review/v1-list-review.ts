import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { studentReviewModel } from "./model-student-review";
import { reviewModel } from "./model-review-activity";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { studentModel } from "../model-student";

const querySchema = z.object({
  include: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
  studentId: z.string().optional().nullable(),
});

export const v1ListReviewActivities = p.route.get({
  key: "listReviewActivities",
  querySchema,
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw(["STUDENT", "COORDINATOR"])],
  },
  path: "/activities",
  async resolver({ query }, ctx) {
    let { include, page = 1, pageSize = 10, search, studentId } = query;

    const { courseId, user, student } = ctx;

    if (user.role === "STUDENT") {
      studentId = ctx.studentId;
    } else if (user.role === "COORDINATOR") {
      if (!studentId) {
        p.error.badRequest("StudentId is required");
      }

      const student = await studentModel.findFirst({
        where: {
          id: studentId,
          courseId,
        },
      });

      if (!student) {
        p.error.badRequest("Student not found");
      }
    }

    const offset = (page - 1) * pageSize;

    pageSize = Number(pageSize);
    page = Number(page);

    const reviewStudent = await studentReviewModel.findFirst({
      where: {
        studentId,
      },
    });

    if (!reviewStudent) {
      p.error.badRequest("Student not found");
    }

    const total = await reviewModel.count({
      where: {
        studentReviewId: reviewStudent.id,
        ...(search && {
          activityOnCategory: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                code: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        }),
      },
    });

    const querySchema: Prisma.ReviewActivityFindFirstArgs = {
      ...(include && getInclude(include)),
      where: {
        studentReviewId: reviewStudent.id,
        ...(search && {
          activityOnCategory: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                code: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        }),
      },
      include: {
        activityOnCategory: true,
      },
      skip: offset,
      take: pageSize,
    };

    const activities = await reviewModel.findMany(querySchema);

    const totalPages = Math.ceil(total / pageSize);

    return {
      activities,
      total,
      page,
      totalPages,
    };
  },
});
