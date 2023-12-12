import p from "pomme-ts";
import { v1CreateDepartment } from "./v1-create-department";
import { v1ListDepartament } from "./v1-list-departaments";
import { v1updateDepartment } from "./v1-update-department";

export const departamentController = p
  .controller()
  .withPath("/department")
  .withRoutes([v1CreateDepartment, v1ListDepartament, v1updateDepartment])
  .build();
