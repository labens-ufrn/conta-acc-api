import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import p from "pomme-ts";

import { userModel } from "./model-user";

export const v1DeleteUser = p.route.delete({
  key: "userCourse",
  path: "/:id",
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw("SYSADMIN")],
  },
  async resolver(input, ctx) {
    const { id } = input.params;

    //todo check auth

    const userFound = await userModel.findUnique({
      where: {
        id,
      },
    });

    if (!userFound) {
      p.error.badRequest("User not found");
    }

    const user = await userModel.delete({
      where: {
        id,
      },
    });

    return user;
  },
});
