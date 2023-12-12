import p from "pomme-ts";
import { v1ListCategories } from "./v1-list-categories";
import { v1CreateCategory } from "./v1-create-categories";
import { v1UpdateCategory } from "./v1-update-category";

export const categoriesController = p
  .controller()
  .withPath("/categories")
  .withRoutes([v1ListCategories, v1CreateCategory, v1UpdateCategory])
  .build();
