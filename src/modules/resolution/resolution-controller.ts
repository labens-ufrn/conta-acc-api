import p from "pomme-ts";
import { v1ListResolution } from "./v1-list-resolution";
import { v1CreateResolution } from "./v1-create-resolution";

export const resolutionController = p
  .controller()
  .withPath("/resolution")
  .withRoutes([v1ListResolution, v1CreateResolution])
  .build();
