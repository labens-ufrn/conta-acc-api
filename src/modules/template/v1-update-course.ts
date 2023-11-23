import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { courseModel } from "./model-course";

const bodySchema = z.object({
  name: z.string().optional(),
});

export const v1UpdateTemplate = p.route.post({
  key: "updateTemplate",
  path: "/:id",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name } = body;

    const template = await {}.create({
      data: {
        name,
      },
    });

    return {
      template,
    };
  },
});
