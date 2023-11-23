import p from "pomme-ts";
import { z } from "zod";
import { courseModel } from "./model-course";

const bodySchema = z.object({
  name: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const v1UpdateCourse = p.route.put({
  key: "updateCourse",
  path: "/:id",
  bodySchema,
  async resolver({ body, params }, ctx) {
    const { name, status } = body;
    const { id } = params;

    const courseFound = await courseModel.findUnique({
      where: {
        id,
      },
    });

    if (!courseFound) {
      p.error.notFound("Course not found");
    }

    const course = await courseModel.update({
      where: {
        id,
      },
      data: {
        name,
        status,
      },
    });

    return {
      course,
    };
  },
});
