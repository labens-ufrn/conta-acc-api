import p from "pomme-ts";
import { v1CreateUser } from "./v1-create-user";
import { v1DeleteUser } from "./v1-list-user";
import { v1UpdateUser } from "./v1-update-user";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { v1ListUsers } from "./v1-delete-user";

export const userController = p
  .controller()
  .withPath("/user")
  .withMiddlewares([isAuthenticatedRoleMw(["ADMIN", "SYSADMIN"])])
  .withRoutes([v1CreateUser, v1ListUsers, v1UpdateUser, v1DeleteUser])
  .build();
