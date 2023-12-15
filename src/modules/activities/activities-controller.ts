import p from "pomme-ts";
import { v1ListActivities } from "./v1-list-activities";
import { v1CreateActivity } from "./v1-create-activity";
import { v1UpdateActivity } from "./v1-update-activity";

export const activitiesController = p
  .controller()
  .withPath("/activities")
  .withRoutes([v1ListActivities, v1CreateActivity, v1UpdateActivity])
  .build();
