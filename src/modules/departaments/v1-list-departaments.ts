import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { departmentModel } from "./model-departament";

const querySchema = z.object({
  include: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const v1ListDepartament = p.route.get({
  key: "listDepartaments",
  querySchema,
  async resolver({ query }, ctx) {
    let { include, page = 1, pageSize = 10, search } = query;

    pageSize = Number(pageSize);
    page = Number(page);

    const offset = (page - 1) * pageSize;

    const total = await departmentModel.count({
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
              sede: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    });

    const querySchema: Prisma.DepartamentFindManyArgs = {
      ...(include && getInclude(include)),
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
              sede: {
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

    const departaments = await departmentModel.findMany(querySchema);

    const totalPages = Math.ceil(total / pageSize);

    return {
      departaments,
      total,
      page,
      totalPages,
    };
  },
});
