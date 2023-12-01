import p from "pomme-ts";
import { z } from "zod";
import { categoryModel } from "../categories/model-categories";
import { activitiesModel } from "./model-activities";

const bodySchema = z.object({
  name: z.string(),
  code: z.string(),
  workloadSemester: z.number().optional(),
  workloadActivity: z.number().optional(),
  description: z.string().optional(),
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

    const activity = await activitiesModel.create({
      data: {
        name,
        code,
        description,
        workloadActivity,
        workloadSemester,
        categoryId,
      },
    });

    return activity;
  },
});
