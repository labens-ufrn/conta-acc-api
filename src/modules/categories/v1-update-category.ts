import p from "pomme-ts";
import { z } from "zod";
import { categoryModel } from "./model-categories";

const bodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  minPoints: z.number().optional().nullable(),
  maxPoints: z.number().optional().nullable(),
});

export const v1UpdateCategory = p.route.put({
  key: "updateCategory",
  path: "/:id",
  bodySchema,
  async resolver({ body, params }, ctx) {
    const { name, description, minPoints, maxPoints } = body;
    const { id } = params;

    const categoryFound = await categoryModel.findUnique({
      where: {
        id,
      },
    });

    if (!categoryFound) {
      p.error.badRequest("Category not found");
    }

    const category = await categoryModel.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        minPoints,
        maxPoints,
      },
    });

    return category;
  },
});
