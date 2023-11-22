import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { courseModel } from "./model-course";

const bodySchema = z.object({
  name: z.string(),
});

export const v1CreateCourse = p.route.post({
  key: "createCourse",
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
