import p from "pomme-ts";
import { categoryModel } from "./model-categories";
import { courseModel } from "../course/model-course";
import { resolutionModel } from "../resolution/model-resolution";

export const v1DeleteCategory = p.route.delete({
  key: "deleteCategory",
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

    const resolutionFound = await resolutionModel.findUnique({
      where: {
        id,
        courseId,
      },
    });

    if (!resolutionFound) {
      p.error.badRequest("Resolution not found");
    }

    const categoryFound = await categoryModel.findUnique({
      where: {
        id,
        resolutionId: resolutionFound.id,
      },
    });

    if (!categoryFound) {
      p.error.badRequest("Department not found");
    }

    const category = await categoryModel.delete({
      where: {
        id,
      },
    });

    return category;
  },
});
