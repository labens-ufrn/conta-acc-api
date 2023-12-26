import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getInclude } from "@src/core/utils/helper-include";
import { categoryModel } from "./model-categories";
import { resolutionModel } from "../resolution/model-resolution";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";

const querySchema = z.object({
  include: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
  id: z.string().optional(),
  resolutionId: z.string(),
});

export const v1ListCategories = p.route.get({
  key: "listCategories",
  querySchema,
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw(["ADMIN", "COORDINATOR", "STUDENT"])],
  },
  async resolver({ query }, ctx) {
    let { include, page = 1, pageSize = 10, search, id, resolutionId } = query;

    const { courseId } = ctx;

    pageSize = Number(pageSize);
    page = Number(page);

    const resolutionFound = await resolutionModel.findUnique({
      where: {
        id: resolutionId,
        courseId,
      },
    });

    if (!resolutionFound) {
      p.error.badRequest("Resolution not found");
    }

    const offset = (page - 1) * pageSize;

    const total = await categoryModel.count({
      where: {
        resolutionId,
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

    const querySchema: Prisma.CategoriesFindManyArgs = {
      ...(include && getInclude(include)),
      where: {
        resolutionId,
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
