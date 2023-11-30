import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { resolutionModel } from "./model-resolution";

const bodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

export const v1UpdateResolution = p.route.put({
  key: "updateResolution",
  path: "/:id",
  bodySchema,
  async resolver({ body, params }, ctx) {
    const { name, description, link, isCurrent } = body;
    const { id } = params;

    const resolutionFound = await resolutionModel.findUnique({
      where: {
        id,
      },
    });

    if (!resolutionFound) {
      p.error.badRequest("Resolution not found");
    }

    const resolution = await resolutionModel.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        link,
        isCurrent,
      },
    });

    return resolution;
  },
});
