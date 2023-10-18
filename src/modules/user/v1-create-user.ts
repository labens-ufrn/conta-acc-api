import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "./model-user";
import { domainModel } from "../domain/model-domain";

const bodySchema = z.object({
  domainId: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.string(),
});

export const v1CreateUser = p.route.post({
  key: "createUser",
  bodySchema,
  async resolver(input, ctx) {
    const { name, email, password, role, domainId } = input.body;

    const domainExists = await domainModel.count({
      where: {
        id: domainId,
      },
    });

    if (!domainExists) {
      throw new Error("Course not found");
    }

    const user = await userModel.create({
      data: {
        name,
        email,
        password: userModel.hashPassword(password),
        role: role as any,
      },
    });

    return {
      user,
    };
  },
});
