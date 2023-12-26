import { isAuthenticatedRoleMw } from "@src/core/middlewares/is-authenticated-role-mw";
import p from "pomme-ts";
import { courseModel } from "./model-course";

export const v1DeleteCourse = p.route.delete({
  key: "deleteCourse",
  path: "/:id",
  noMw: true,
  options: {
    middlewares: [isAuthenticatedRoleMw("SYSADMIN")],
  },
  async resolver(input, ctx) {
    const { id } = input.params;

    const courseFound = await courseModel.findUnique({
      where: {
        id,
      },
    });

    if (!courseFound) {
      p.error.badRequest("Course not found");
    }

    const course = await courseModel.delete({
      where: {
        id,
      },
    });

    return course;
  },
});
