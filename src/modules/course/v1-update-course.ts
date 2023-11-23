import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { courseModel } from "./model-course";

const bodySchema = z.object({
  name: z.string().optional(),
});

export const v1UpdateCourse = p.route.post({
  key: "updateCourse",
  path: "/:id",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name } = body;

    const course = await courseModel.create({
      data: {
        name,
      },
    });

    return {
      course,
    };
  },
});
