import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "./model-user";
import { courseModel } from "../course/model-course";

const bodySchema = z.object({
  courseId: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.string(),
});

export const v1CreateUser = p.route.post({
  key: "createUser",
  bodySchema,
  async resolver(input, ctx) {
    const { name, email, password, role, courseId } = input.body;

    const courseExist = await courseModel.count({
      where: {
        id: courseId,
      },
    });

    if (!courseExist) {
      p.error.badRequest("Course not found");
    }

    const emailExist = await userModel.count({
      where: {
        email,
      },
    });

    if (emailExist) {
      p.error.badRequest("Email already in use");
    }

    const user = await userModel.create({
      data: {
        name,
        email,
        password: userModel.hashPassword(password),
        role: role as any,
        courseId,
      },
    });

    return {
      user,
    };
  },
});
