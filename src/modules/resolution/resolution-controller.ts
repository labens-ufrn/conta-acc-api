import p from "pomme-ts";
import { v1ListResolution } from "./v1-list-resolution";
import { v1CreateResolution } from "./v1-create-resolution";
import { v1UpdateResolution } from "./v1-update-resolution";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { v1DeleteResolution } from "./v1-delete-departament";

export const resolutionController = p
  .controller()
  .withPath("/resolution")
  .withMiddlewares([isAuthenticatedRoleMw(["ADMIN"])])
  .withRoutes([
    v1ListResolution,
    v1CreateResolution,
    v1UpdateResolution,
    v1DeleteResolution,
  ])
  .build();
