import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { courseModel } from "./model-course";
import { departmentModel } from "../departaments/model-departament";

const bodySchema = z.object({
  name: z.string(),
  departmentId: z.string(),
});

export const v1CreateCourse = p.route.post({
  key: "createCourse",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name, departmentId } = body;

    const departmentFound = await departmentModel.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!departmentFound) p.error.badRequest("Departament not found");

    const course = await courseModel.create({
      data: {
        name,
        departmentId,
      },
    });

    return {
      course,
    };
  },
});
