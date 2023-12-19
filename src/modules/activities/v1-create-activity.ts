import p from "pomme-ts";
import { z } from "zod";
import { categoryModel } from "../categories/model-categories";
import { activitiesModel } from "./model-activities";
import { activitiesOnCategoryModel } from "./model-activities-on-category";

const bodySchema = z.object({
  name: z.string(),
  code: z.string(),
  workloadSemester: z.number().optional().nullable(),
  workloadActivity: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  categoryId: z.string(),
});

export const v1CreateActivity = p.route.post({
  key: "createActivity",
  bodySchema,
  async resolver({ body }, ctx) {
    const {
      name,
      categoryId,
      code,
      description,
      workloadActivity,
      workloadSemester,
    } = body;

    const categoryFoiund = await categoryModel.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryFoiund) {
      p.error.badRequest("Category not found");
    }

    if (!workloadActivity && !workloadSemester) {
      p.error.badRequest(
        "You must provide workloadActivity or workloadSemester"
      );
    }

    const activityCreated = await activitiesModel.create({
      data: {},
    });

    if (!activityCreated) {
      p.error.serverError("Error on create activity");
    }

    const activity = await activitiesOnCategoryModel.create({
      data: {
        name,
        code,
        description,
        workloadActivity,
        workloadSemester,
        categoryId,
        activityId: activityCreated.id,
      },
    });

    return activity;
  },
});
