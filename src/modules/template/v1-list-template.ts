import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { courseModel } from "./model-course";

const querySchema = z.object({
  include: z.enum(["users"]).optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const v1ListTemplate = p.route.get({
  key: "listTemplate",
  querySchema,
  async resolver({ query }, ctx) {
    const { include, page = 1, pageSize = 10, search } = query;

    const offset = (page - 1) * pageSize;

    const total = await {}.count({
      ...(search && {
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    });

    const querySchema: Prisma. = {
      ...(include && {
        include: getInclude(include),
      }),
      ...(search && {
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      }),
      skip: offset,
      take: pageSize,
    };

    const templates = await {}.findMany(querySchema);

    const totalPages = Math.ceil(total / pageSize);

    return {
      templates,
      total,
      page,
      totalPages,
    };
  },
});
