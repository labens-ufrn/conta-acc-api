import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { courseModel } from "../course/model-course";
import { resolutionModel } from "./model-resolution";

const bodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  link: z.string().optional(),
  courseId: z.string(),
  isCurrent: z.boolean().optional(),
});

export const v1CreateResolution = p.route.post({
  key: "createResolution",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name, courseId, description, link, isCurrent } = body;

    const course = await courseModel.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      p.error.badRequest("Course not found");
    }

    const resolution = await resolutionModel.create({
      data: {
        name,
        description,
        link,
        isCurrent,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    return resolution;
  },
});
