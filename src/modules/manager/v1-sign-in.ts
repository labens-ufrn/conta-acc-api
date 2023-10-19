import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "../user/model-user";
import { generateJwt } from "../user/helper-jwt";

const bodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

const querySchema = z.object({
  include: z.string().optional(),
});

export const v1SignIn = p.route.post({
  key: "signIn",
  path: "/sign-in",
  bodySchema,
  querySchema,
  async resolver(input, ctx) {
    const { email, password } = input.body;
    const { include } = input.query;
    const { reqIpAddress, reqIpCountry, reqUserAgent } = ctx;

    const userExisted = await userModel.findFirst({
      where: {
        email,
      },
      ...(include && {
        include: {
          course: include.includes("course"),
        },
      }),
    });

    if (!userExisted) {
      throw new Error("Email or password is incorrect");
    }

    if (userExisted.status !== "ACTIVE") {
      throw new Error("Your account is not active");
    }

    const passwordMatched = userModel.comparePassword(
      password,
      userExisted.password
    );

    if (!passwordMatched) {
      throw new Error("Email or password is incorrect");
    }

    const { id, createdAt } = userExisted;

    const token = generateJwt({
      id,
      courseId: userExisted.courseId,
      createdAt,
      reqIpAddress,
      reqIpCountry,
      reqUserAgent,
    });

    return {
      user: userExisted,
      token: token.token,
    };
  },
});
