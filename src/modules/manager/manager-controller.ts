import p from "pomme-ts";
import { v1SignIn } from "./v1-sign-in";
import { v1SignUp } from "./v1-sign-up";

export const managerController = p
  .controller()
  .withPath("/manager")
  .withRoutes([v1SignIn, v1SignUp])
  .build();
