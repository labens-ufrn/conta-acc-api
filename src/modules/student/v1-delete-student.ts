import p from "pomme-ts";
import { courseModel } from "../course/model-course";
import { studentModel } from "./model-student";

export const v1DeleteActivity = p.route.delete({
  key: "deleteActivity",
  path: "/:id",
  async resolver(input, ctx) {
    const { id } = input.params;

    const { courseId } = ctx;

    const courseFound = await courseModel.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!courseFound) {
      p.error.badRequest("Course not found");
    }

    const studentFound = await studentModel.findUnique({
      where: {
        id,
        courseId,
      },
    });

    if (!studentFound) {
      p.error.badRequest("Student not found");
    }

    const student = await studentModel.delete({
      where: {
        id,
      },
    });

    return student;
  },
});
