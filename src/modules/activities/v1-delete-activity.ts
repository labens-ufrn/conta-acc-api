import p from "pomme-ts";
import { courseModel } from "../course/model-course";
import { resolutionModel } from "../resolution/model-resolution";
import { activitiesOnCategoryModel } from "./model-activities-on-category";

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

    const resolutionFound = await resolutionModel.findUnique({
      where: {
        id,
        courseId,
      },
    });

    if (!resolutionFound) {
      p.error.badRequest("Resolution not found");
    }

    const activityFound = await activitiesOnCategoryModel.findUnique({
      where: {
        id,
        category: {
          resolutionId: resolutionFound.id,
        },
      },
    });

    if (!activityFound) {
      p.error.badRequest("Activity not found");
    }

    const activity = await activitiesOnCategoryModel.delete({
      where: {
        id,
      },
    });

    return activity;
  },
});
