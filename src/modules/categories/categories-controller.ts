import p from "pomme-ts";
import { v1ListCategories } from "./v1-list-categories";
import { v1CreateCategory } from "./v1-create-categories";
import { v1UpdateCategory } from "./v1-update-category";
import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import { v1DeleteCategory } from "./v1-delete-category";

export const categoriesController = p
  .controller()
  .withPath("/categories")
  .withMiddlewares([isAuthenticatedRoleMw(["ADMIN", "COORDINATOR"])])
  .withRoutes([
    v1ListCategories,
    v1CreateCategory,
    v1UpdateCategory,
    v1DeleteCategory,
  ])
  .build();
