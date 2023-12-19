import p from "pomme-ts";
import { z } from "zod";
import { activitiesModel } from "./model-activities";
import { activitiesOnCategoryModel } from "./model-activities-on-category";

const bodySchema = z.object({
  name: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  workloadSemester: z.number().optional().nullable(),
  workloadActivity: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const v1UpdateActivity = p.route.put({
  key: "updateActivity",
  path: "/:activityId",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name, code, description, workloadActivity, workloadSemester } =
      body;

    const { activityId } = ctx.params;

    const activityFound = await activitiesOnCategoryModel.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!activityFound || !activityFound.activityId) {
      p.error.badRequest("Activity not found");
    }

    if (!workloadActivity && !workloadSemester) {
      p.error.badRequest(
        "You must provide workloadActivity or workloadSemester"
      );
    }

    const activity = await activitiesOnCategoryModel.update({
      where: {
        id: activityId,
      },
      data: {
        name,
        code,
        description,
        workloadActivity,
        workloadSemester,
      },
    });

    return activity;
  },
});
