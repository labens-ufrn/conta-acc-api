import p from "pomme-ts";
import { z } from "zod";
import { resolutionModel } from "./model-resolution";

const bodySchema = z.object({
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  isCurrent: z.boolean().optional().nullable(),
});

export const v1UpdateResolution = p.route.put({
  key: "updateResolution",
  path: "/:id",
  bodySchema,
  async resolver({ body, params }, ctx) {
    const { name, description, link, isCurrent } = body;
    const { id } = params;

    const { courseId } = ctx;

    const resolutionFound = await resolutionModel.findUnique({
      where: {
        id,
      },
    });

    if (!resolutionFound) {
      p.error.badRequest("Resolution not found");
    }

    if (isCurrent) {
      await resolutionModel.updateMany({
        where: {
          course: {
            id: courseId,
          },
        },
        data: {
          isCurrent: false,
        },
      });
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
