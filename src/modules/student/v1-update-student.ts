import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "../user/model-user";
import { studentModel } from "./model-student";

const bodySchema = z.object({
  name: z.string().optional().nullable(),
  enrollId: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
});

export const v1UpdateStudent = p.route.put({
  key: "updateStudent",
  path: "/:studentId",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name, email, enrollId, password } = body;

    const { studentId } = ctx.params;

    const { courseId } = ctx;

    if (email) {
      const userFound = await userModel.findFirst({
        where: {
          email,
          id: {
            not: studentId,
          },
        },
      });

      if (userFound) {
        p.error.badRequest("Email already in use");
      }
    }

    const student = await studentModel.update({
      where: {
        id: studentId,
        courseId,
      },
      data: {
        enrollId,
      },
    });

    const user = await userModel.update({
      where: {
        id: student.userId,
        courseId,
      },
      data: {
        name,
        email,
        ...(password && {
          password: userModel.hashPassword(password),
        }),
      },
    });

    return student;
  },
});
