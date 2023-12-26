import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { studentReviewModel } from "./model-student-review";
import { reviewModel } from "./model-review-activity";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { resolutionModel } from "@src/modules/resolution/model-resolution";
import { prismaClient } from "@src/core/db/prisma";
import { activitiesModel } from "@src/modules/activities/model-activities";
import { activitiesOnCategoryModel } from "@src/modules/activities/model-activities-on-category";

export const v1InfoActivities = p.route.get({
  key: "infoActivities",
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw(["STUDENT"])],
  },
  path: "/me/info",
  async resolver({ query }, ctx) {
    let { include, page = 1, pageSize = 10, search } = query;

    const { courseId, studentId } = ctx;

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

    const sumOfPoints = values.reduce((acc, item) => {
      return acc + item.points;
    }, 0);

    return {
      resolution: reviewStudent.resolution,
      semesters: result,
      sumOfPoints,
      isConcluded: sumOfPoints >= reviewStudent.resolution.totalPoints,
    };
  },
});
