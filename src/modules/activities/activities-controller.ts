import p from "pomme-ts";
import { v1ListActivities } from "./v1-list-activities";

export const activitiesController = p
  .controller()
  .withPath("/activities")
  .withRoutes([v1ListActivities])
  .build();
