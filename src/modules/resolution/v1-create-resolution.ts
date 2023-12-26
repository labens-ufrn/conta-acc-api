import p from "pomme-ts";
import { z } from "zod";
import { courseModel } from "../course/model-course";
import { resolutionModel } from "./model-resolution";
import { categoryModel } from "../categories/model-categories";
import { activitiesOnCategoryModel } from "../activities/model-activities-on-category";
import { studentReviewModel } from "../student/review/model-student-review";

const bodySchema = z.object({
  name: z.string(),
  totalPoints: z.number(),
  description: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  isCurrent: z.boolean().optional().nullable(),
  copyFrom: z.string().optional().nullable(),
});

export const v1CreateResolution = p.route.post({
  key: "createResolution",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name, description, link, isCurrent, copyFrom, totalPoints } = body;

    const { courseId } = ctx;

    const course = await courseModel.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      p.error.badRequest("Course not found");
    }

    if (isCurrent) {
      await resolutionModel.updateMany({
        where: {
          course: {
            id: courseId,
          },
        },
        data: {
          isCurrent: false,
        },
      });
    }

    const resolution = await resolutionModel.create({
      data: {
        name,
        description,
        link,
        isCurrent,
        totalPoints,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    if (isCurrent) {
      await studentReviewModel.updateMany({
        where: {
          student: {
            courseId,
          },
        },
        data: {
          resolutionId: resolution.id,
        },
      });
    }

    let errors = [];

    if (copyFrom) {
      const copyFromResolution = await resolutionModel.findUnique({
        where: {
          id: copyFrom,
        },
        include: {
          categories: true,
        },
      });

      if (!copyFromResolution) {
        errors.push("Resolution to copy from not found");
        return;
      }

      copyFromResolution.categories.forEach(async (copyCategory) => {
        const category = await categoryModel.create({
          data: {
            name: copyCategory.name,
            description: copyCategory.description,
            resolution: {
              connect: {
                id: resolution.id,
              },
            },
          },
        });

        const activitiesOnCategory = await activitiesOnCategoryModel.findMany({
          where: {
            categoryId: copyCategory.id,
          },
        });

        await activitiesOnCategoryModel.createMany({
          data: activitiesOnCategory.map((activityOnCategory) => ({
            activityId: activityOnCategory.activityId,
            categoryId: category.id,
            code: activityOnCategory.code,
            name: activityOnCategory.name,
            description: activityOnCategory.description,
            workloadSemester: activityOnCategory.workloadSemester,
            workloadActivity: activityOnCategory.workloadActivity,
          })),
        });
      });
    }

    console.log(errors);

    return resolution;
  },
});
