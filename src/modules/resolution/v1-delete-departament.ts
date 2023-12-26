import p from "pomme-ts";
import { resolutionModel } from "./model-resolution";

export const v1DeleteResolution = p.route.delete({
  key: "deleteResolution",
  path: "/:id",
  async resolver(input, ctx) {
    const { id } = input.params;
    const { courseId } = ctx;

    const resolutionFound = await resolutionModel.findUnique({
      where: {
        id,
        courseId,
      },
    });

    if (!resolutionFound) {
      p.error.badRequest("Department not found");
    }

    const resolution = await resolutionModel.delete({
      where: {
        id,
      },
    });

    return resolution;
  },
});
