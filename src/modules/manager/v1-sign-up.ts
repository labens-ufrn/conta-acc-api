import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "../user/model-user";

const bodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const v1SignUp = p.route.post({
  key: "signUp",
  path: "/sign-up",
  bodySchema,
  async resolver(input, ctx) {
    const { email, password, name } = input.body;

    const userExisted = await userModel.findUnique({
      where: {
        email,
      },
    });

    if (userExisted) {
      throw new Error("User already existed");
    }

    const user = await userModel.create({
      data: {
        email,
        name,
        password: userModel.hashPassword(password),
      },
    });

    return {
      user,
    };
  },
});
