import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import p from "pomme-ts";
import { departmentModel } from "./model-departament";

export const v1DeleteDepartament = p.route.delete({
  key: "deleteDepartament",
  path: "/:id",
  options: {
    middlewares: [isAuthenticatedRoleMw("SYSADMIN")],
  },
  async resolver(input, ctx) {
    const { id } = input.params;

    const departmentFound = await departmentModel.findUnique({
      where: {
        id,
      },
    });

    if (!departmentFound) {
      p.error.badRequest("Department not found");
    }

    const department = await departmentModel.delete({
      where: {
        id,
      },
    });

    return department;
  },
});
