import p from "pomme-ts";
import { z } from "zod";
import { courseModel } from "./model-course";
import { departmentModel } from "../departaments/model-departament";

const bodySchema = z.object({
  name: z.string().optional(),
  departmentId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const v1UpdateCourse = p.route.put({
  key: "updateCourse",
  path: "/:id",
  bodySchema,
  async resolver({ body, params }, ctx) {
    const { name, status, departmentId } = body;
    const { id } = params;

    if (departmentId) {
      const departmentFound = await departmentModel.findUnique({
        where: {
          id: departmentId,
        },
      });

      if (!departmentFound) {
        p.error.notFound("Department not found");
      }
    }

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
        departmentId,
      },
    });

    return {
      course,
    };
  },
});
