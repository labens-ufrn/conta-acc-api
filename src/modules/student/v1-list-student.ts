import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { studentModel } from "./model-student";

const querySchema = z.object({
  include: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const v1ListStudent = p.route.get({
  key: "listStudent",
  querySchema,
  async resolver({ query }, ctx) {
    let { include, page = 1, pageSize = 10, search } = query;

    const { courseId } = ctx;

    const offset = (page - 1) * pageSize;

    pageSize = Number(pageSize);
    page = Number(page);

    const total = await studentModel.count({
      where: {
        courseId,
        ...(search && {
          enrollId: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
    });

    const querySchema: Prisma.StudentFindManyArgs = {
      ...(include && getInclude(include)),
      where: {
        courseId,
        ...(search && {
          OR: [
            {
              enrollId: {
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

    const students = await studentModel.findMany(querySchema);

    const totalPages = Math.ceil(total / pageSize);

    return {
      students,
      total,
      page,
      totalPages,
    };
  },
});
