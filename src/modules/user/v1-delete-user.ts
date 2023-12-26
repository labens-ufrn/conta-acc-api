import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "./model-user";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";

const querySchema = z.object({
  include: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
  role: z.string().optional(),
  courseId: z.string().optional(),
});

export const v1ListUsers = p.route.get({
  key: "listUsers",
  querySchema,
  async resolver(input, ctx) {
    let {
      include,
      page = 1,
      pageSize = 10,
      search,
      courseId,
      role,
    } = input.query;

    page = Number(page);
    pageSize = Number(pageSize);

    const offset = (page - 1) * pageSize;

    const total = await userModel.count({
      where: {
        ...(role && {
          role: role.toUpperCase() as any,
        }),
        ...(courseId && {
          courseId,
        }),
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
    });

    const query: Prisma.UserFindManyArgs = {
      ...(include && getInclude(include)),
      where: {
        ...(role && {
          role: role.toUpperCase() as any,
        }),
        ...(courseId && {
          courseId,
        }),
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
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

    const users = await userModel.findMany(query);

    const totalPages = Math.ceil(total / pageSize);

    return {
      users,
      total,
      page,
      totalPages,
    };
  },
});
