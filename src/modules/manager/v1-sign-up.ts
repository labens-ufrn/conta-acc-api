import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "../user/model-user";
import { studentModel } from "../student/model-student";

const bodySchema = z.object({
  name: z.string(),
  enrollId: z.string(),
  email: z.string(),
  password: z.string(),
});

export const v1SignUp = p.route.post({
  key: "signUp",
  path: "/student/sign-up",
  bodySchema,
  async resolver({ body }, ctx) {
    const { email, password, name, enrollId } = body;

    const userExisted = await userModel.findUnique({
      where: {
        email,
      },
    });

    const studentExisted = await studentModel.findFirst({
      where: {
        enrollId,
      },
    });

    if (userExisted) {
      p.error.badRequest("User already existed");
    }

    if (studentExisted) {
      p.error.badRequest("User already existed");
    }

    const user = await userModel.create({
      data: {
        email,
        name,
        password: userModel.hashPassword(password),
        role: "STUDENT",
      },
    });

    return {
      user,
    };
  },
});
