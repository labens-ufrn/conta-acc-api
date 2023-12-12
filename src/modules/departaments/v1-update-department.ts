import p from "pomme-ts";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { departmentModel } from "./model-departament";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";

const bodySchema = z.object({
  name: z.string().optional(),
  sede: z.string().optional(),
});

export const v1updateDepartment = p.route.put({
  key: "updateDepartment",
  path: "/:id",
  bodySchema,
  options: {
    middlewares: [isAuthenticatedRoleMw("SYSADMIN")],
  },
  async resolver({ body, params }, ctx) {
    const { name, sede } = body;
    const { id } = params;

    const departamentFound = await departmentModel.findUnique({
      where: {
        id,
      },
    });

    if (!departamentFound) p.error.badRequest("Departament not found");

    const departament = await departmentModel.update({
      where: {
        id,
      },
      data: {
        name,
        sede,
      },
    });

    return departament;
  },
});
