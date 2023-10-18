import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "./model-user";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";

const querySchema = z.object({
  include: z.enum(["users"]).optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const v1ListUsers = p.route.get({
  key: "listUsers",
  querySchema,
  async resolver(input, ctx) {
    const { include, page = 1, pageSize = 10, search } = input.query;

    const offset = (page - 1) * pageSize;

    const total = await userModel.count({
      ...(search && {
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    });

    const query: Prisma.UserFindManyArgs = {
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
            {
              email: {
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
