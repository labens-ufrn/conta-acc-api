import p from "pomme-ts";
import { map, z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { studentReviewModel } from "./model-student-review";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { prismaClient } from "@src/core/db/prisma";
import { activitiesOnCategoryModel } from "@src/modules/activities/model-activities-on-category";
import { categoryModel } from "@src/modules/categories/model-categories";
import { reviewModel } from "./model-review-activity";

const querySchema = z.object({
  studentId: z.string().optional().nullable(),
});

export const v1InfoActivities = p.route.get({
  key: "infoActivities",
  noMw: true,
  querySchema,
  options: {
    middlewares: [isAuthenticatedRoleMw(["STUDENT", "COORDINATOR"])],
  },
  path: "/info",
  async resolver({ query }, ctx) {
    let { studentId } = query;

    const { courseId, user } = ctx;

    if (user.role === "STUDENT") {
      studentId = ctx.studentId;
    } else if (user.role === "COORDINATOR") {
      if (!studentId) {
        p.error.badRequest("StudentId is required");
      }

      const student = await prismaClient.student.findFirst({
        where: {
          id: studentId,
          courseId,
        },
      });

      if (!student) {
        p.error.badRequest("Student not found");
      }
    }

    const reviewStudent = await studentReviewModel.findFirst({
      where: {
        studentId,
      },
      include: {
        resolution: true,
      },
    });

    if (!reviewStudent) {
      p.error.badRequest("Student not found");
    }

    if (reviewStudent.resolutionId === null) {
      p.error.badRequest("Student dont have resolution");
    }

    const values: any[] = await prismaClient.$queryRaw`
      SELECT
        outtable.id,
        outtable.semester,
        outtable."workloadSemester",
        CAST(LEAST(outtable.points, outtable."workloadSemester") AS INT) AS points
      FROM (
        SELECT
          aoc.id,
          ra.semester,
          aoc."workloadActivity",
          aoc."workloadSemester",
          SUM(aoc."workloadActivity") AS points
        FROM
          "reviewActivities" AS ra
          INNER JOIN "activitiesOnCategories" aoc ON aoc.id = ra."activityOnCategoryId"
        WHERE
          ra."studentReviewId" = ${reviewStudent.id}
          AND ra.status != 'REJECTED'
        GROUP BY
          ra.semester,
          aoc.id
      ) AS outtable
        `;

    const allActivities = await activitiesOnCategoryModel.findMany({
      where: {
        id: {
          in: [...new Set(values.map((v) => v.id))],
        },
      },
      include: {
        category: true,
      },
    });

    const activitiesWithInput = await reviewModel.findMany({
      where: {
        studentReviewId: reviewStudent.id,
        activityOnCategory: {
          workloadInput: true,
        },
      },
    });

    const mappedValues = values.map((v) => {
      const activity = allActivities.find((a) => a.id === v.id);

      return {
        ...activity,
        semester: v.semester,
        totalPointsOfSemester: v.points,
      };
    });

    const result = mappedValues.reduce((acc, item) => {
      const semester = item.semester;

      if (!acc[semester]) {
        acc[semester] = [];
      }

      acc[semester].push(item);
      return acc;
    }, {});

    const groupedData = mappedValues.reduce((acc, item) => {
      const categoryId = item.categoryId;

      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId: categoryId,
          totalPointsOfSemester: 0,
        };
      }

      acc[categoryId].totalPointsOfSemester += item.totalPointsOfSemester;

      return acc;
    }, {});

    const resultArray: any[] = Object.values(groupedData);

    const sumMapped = resultArray.reduce((acc, item) => {
      const { category } = allActivities.find(
        (a) => a.categoryId === item.categoryId
      );

      if (category.maxPoints !== null) {
        item.totalPointsOfSemester = Math.min(
          item.totalPointsOfSemester,
          category.maxPoints
        );
      }

      return acc + item.totalPointsOfSemester;
    }, 0);

    const sumOfInputs = activitiesWithInput.reduce((acc, item) => {
      return acc + (item.inputPoints || 0);
    }, 0);

    const sum = sumMapped + sumOfInputs;

    return {
      resolution: reviewStudent.resolution,
      semesters: result,
      sumOfPoints: sum,
      isConcluded: sum >= reviewStudent.resolution.totalPoints,
    };
  },
});
