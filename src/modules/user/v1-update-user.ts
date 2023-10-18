import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "./model-user";
import { Prisma } from "@prisma/client";

const bodySchema = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
  role: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const v1UpdateUser = p.route.put({
  key: "updateUser",
  path: "/:userId",
  bodySchema,
  async resolver(input, ctx) {
    const { name, password, role, status } = input.body;
    const { userId } = input.params;

    const userExisted = await userModel.count({
      where: {
        id: userId,
      },
    });

    if (!userExisted) {
      throw new Error("User not found");
    }

    const user = await userModel.update({
      where: {
        id: userId,
      },
      data: {
        name,
        password,
        role: role as any,
        status,
      },
    });

    return {
      user,
    };
  },
});
