import p from "pomme-ts";
import { z } from "zod";
import { resolutionModel } from "../resolution/model-resolution";
import { categoryModel } from "./model-categories";

const bodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  resolutionId: z.string(),
});

export const v1CreateCategory = p.route.post({
  key: "createCategory",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name, description, resolutionId } = body;

    const resolutionFound = await resolutionModel.findUnique({
      where: {
        id: resolutionId,
      },
    });

    if (!resolutionFound) {
      p.error.badRequest("Resolution not found");
    }

    const category = await categoryModel.create({
      data: {
        name,
        description,
        resolutionId,
      },
    });

    return category;
  },
});
