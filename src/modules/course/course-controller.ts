import p from "pomme-ts";
import { v1ListCourses } from "./v1-list-courses";
import { v1CreateCourse } from "./v1-create-course";
import { v1UpdateCourse } from "./v1-update-course";

export const courseController = p
  .controller()
  .withPath("/course")
  .withRoutes([v1ListCourses, v1CreateCourse, v1UpdateCourse])
  .build();
