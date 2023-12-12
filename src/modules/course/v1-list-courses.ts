import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { courseModel } from "./model-course";

const querySchema = z.object({
  include: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
  id: z.string().optional(),
});

export const v1ListCourses = p.route.get({
  key: "listCourses",
  querySchema,
  noMw: true,
  async resolver({ query }, ctx) {
    let { include, page = 1, pageSize = 10, search, id } = query;

    pageSize = Number(pageSize);
    page = Number(page);

    const offset = (page - 1) * pageSize;

    const total = await courseModel.count({
      where: {
        ...(id && {
          id,
        }),
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
    });

    const querySchema: Prisma.CourseFindManyArgs = {
      ...(include && getInclude(include)),
      where: {
        ...(id && {
          id,
        }),
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },

      skip: offset,
      take: pageSize,
    };

    const courses = await courseModel.findMany(querySchema);

    const totalPages = Math.ceil(total / pageSize);

    return {
      courses,
      total,
      page,
      totalPages,
    };
  },
});
