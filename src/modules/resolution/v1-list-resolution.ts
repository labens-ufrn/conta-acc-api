import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { resolutionModel } from "./model-resolution";

const querySchema = z.object({
  id: z.string().optional(),
  isCurrent: z.boolean().optional(),
  search: z.string().optional(),
  include: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const v1ListResolution = p.route.get({
  key: "listResolution",
  querySchema,
  async resolver({ query }, ctx) {
    let { include, page = 1, pageSize = 10, id, isCurrent, search } = query;

    pageSize = Number(pageSize);
    page = Number(page);

    const { courseId } = ctx;

    const offset = (page - 1) * pageSize;

    const total = await resolutionModel.count({
      where: {
        id,
        isCurrent,
        courseId,
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
    });

    const querySchema: Prisma.ResolutionFindManyArgs = {
      ...(include && getInclude(include)),
      where: {
        id,
        courseId,
        isCurrent,
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: pageSize,
    };

    const resolutions = await resolutionModel.findMany(querySchema);

    const totalPages = Math.ceil(total / pageSize);

    return {
      resolutions,
      total,
      page,
      totalPages,
    };
  },
});
