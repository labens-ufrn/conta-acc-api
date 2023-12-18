import p from "pomme-ts";
import { v1ListStudent } from "./list-student";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";

export const studentController = p
  .controller()
  .withPath("/student")
  .withMiddlewares([isAuthenticatedRoleMw("COORDINATOR")])
  .withRoutes([v1ListStudent])
  .build();
