import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "../user/model-user";
import { isAuthenticatedMw } from "@src/core/middlewares/is-authenticated-mw";

const querySchema = z.object({
  include: z.string().optional(),
});

export const v1Me = p.route.get({
  key: "me",
  path: "/me",
  options: {
    middlewares: [isAuthenticatedMw],
  },
  querySchema,
  async resolver(input, ctx) {
    const { userId } = ctx;

    const user = await userModel.findFirst({
      where: {
        id: userId,
      },
      include: {
        course: true,
      },
    });

    return {
      user,
    };
  },
});
