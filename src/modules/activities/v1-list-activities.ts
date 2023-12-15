import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { activitiesModel } from "./model-activities";
import { categoryModel } from "../categories/model-categories";

const querySchema = z.object({
  include: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const v1ListActivities = p.route.get({
  key: "listActivities",
  path: "/:categoryId",
  querySchema,
  async resolver({ query, params }, ctx) {
    let { include, page = 1, pageSize = 10, search } = query;
    const { categoryId } = params;

    pageSize = Number(pageSize);
    page = Number(page);

    const offset = (page - 1) * pageSize;

    const categoryFound = await categoryModel.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryFound) {
      p.error.badRequest("Category not found");
    }

    const where: Prisma.ActivitiesWhereInput = {
      categoryId,
      ...(search && {
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
      }),
    };

    const total = await activitiesModel.count({
      where,
    });

    const querySchema: Prisma.ActivitiesFindManyArgs = {
      ...(include && getInclude(include)),
      where,
      skip: offset,
      take: pageSize,
    };

    const activities = await activitiesModel.findMany(querySchema);

    const totalPages = Math.ceil(total / pageSize);

    return {
      activities,
      total,
      page,
      totalPages,
    };
  },
});
