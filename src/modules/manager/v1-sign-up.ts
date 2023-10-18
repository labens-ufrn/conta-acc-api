import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "../user/model-user";
import { domainModel } from "../domain/model-domain";

const bodySchema = z.object({
  domainName: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const v1SignUp = p.route.post({
  key: "signUp",
  path: "/sign-up",
  bodySchema,
  async resolver(input, ctx) {
    const { email, password, name, domainName } = input.body;

    const userExisted = await userModel.findUnique({
      where: {
        email,
      },
    });

    if (userExisted) {
      throw new Error("User already existed");
    }

    const domain = await domainModel.create({
      data: {
        name: domainName,
        users: {
          create: {
            email,
            name,
            password: userModel.hashPassword(password),
          },
        },
      },
    });

    return {
      domain,
    };
  },
});
