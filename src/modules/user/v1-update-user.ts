import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "./model-user";

const bodySchema = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email().optional(),
  role: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const v1UpdateUser = p.route.put({
  key: "updateUser",
  path: "/:userId",
  bodySchema,
  async resolver(input, ctx) {
    const { name, password, role, email, status } = input.body;
    const { userId } = input.params;

    const userExisted = await userModel.count({
      where: {
        id: userId,
      },
    });

    if (!userExisted) {
      p.error.badRequest("User not found");
    }

    if (email) {
      const emailInUse = await userModel.count({
        where: {
          AND: [
            {
              email,
            },
            {
              id: {
                not: userId,
              },
            },
          ],
        },
      });

      if (emailInUse) {
        p.error.badRequest("Email already in use");
      }
    }

    const user = await userModel.update({
      where: {
        id: userId,
      },
      data: {
        name,
        ...(password &&
          password.length > 0 && {
            password: userModel.hashPassword(password),
          }),
        role: role as any,
        status,
      },
    });

    return {
      user,
    };
  },
});
