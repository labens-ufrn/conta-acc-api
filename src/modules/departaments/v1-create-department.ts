import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { departmentModel } from "./model-departament";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";

const bodySchema = z.object({
  name: z.string(),
  sede: z.string(),
});

export const v1CreateDepartment = p.route.post({
  key: "createDepartment",
  bodySchema,
  options: {
    middlewares: [isAuthenticatedRoleMw("SYSADMIN")],
  },
  async resolver({ body }, ctx) {
    const { name, sede } = body;

    const departament = await departmentModel.create({
      data: {
        name,
        sede,
      },
    });

    return departament;
  },
});
