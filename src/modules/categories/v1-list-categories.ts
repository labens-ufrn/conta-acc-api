import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { categoryModel } from "./model-categories";
import { resolutionModel } from "../resolution/model-resolution";

const querySchema = z.object({
  include: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export const v1ListCategories = p.route.get({
  key: "listCategories",
  path: "/:resolutionId",
  querySchema,
  async resolver({ query }, ctx) {
    const { include, page = 1, pageSize = 10, search } = query;

    const { resolutionId } = ctx.params;

    const resolutionFound = await resolutionModel.findUnique({
      where: {
        id: resolutionId,
      },
    });

    if (!resolutionFound) {
      p.error.badRequest("Resolution not found");
    }

    const offset = (page - 1) * pageSize;

    const total = await categoryModel.count({
      where: {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
    });

    const querySchema: Prisma.CategoriesFindManyArgs = {
      ...(include && getInclude(include)),
      where: {
        resolutionId,
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

    const categories = await categoryModel.findMany(querySchema);

    const totalPages = Math.ceil(total / pageSize);

    return {
      categories,
      total,
      page,
      totalPages,
    };
  },
});
