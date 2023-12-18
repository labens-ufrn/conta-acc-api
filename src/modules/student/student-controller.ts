import p from "pomme-ts";
import { v1ListStudent } from "./list-student";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { v1CreateStudent } from "./v1-create-student";
import { v1UpdateStudent } from "./v1-update-student";

export const studentController = p
  .controller()
  .withPath("/student")
  .withMiddlewares([isAuthenticatedRoleMw("COORDINATOR")])
  .withRoutes([v1ListStudent, v1CreateStudent, v1UpdateStudent])
  .build();
