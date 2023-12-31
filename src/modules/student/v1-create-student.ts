import p from "pomme-ts";
import { z } from "zod";
import { userModel } from "../user/model-user";
import { studentModel } from "./model-student";
import { studentReviewModel } from "./review/model-student-review";
import { resolutionModel } from "../resolution/model-resolution";

const bodySchema = z.object({
  name: z.string(),
  enrollId: z.string(),
  email: z.string(),
  password: z.string(),
});

export const v1CreateStudent = p.route.post({
  key: "createStudent",
  bodySchema,
  async resolver({ body }, ctx) {
    const { name, email, enrollId, password } = body;

    const { courseId } = ctx;

    const userFound = await userModel.findFirst({
      where: {
        email,
      },
    });

    if (userFound) {
      p.error.badRequest("Email already in use");
    }

    const enrollIdFound = await studentModel.findFirst({
      where: {
        enrollId,
      },
    });

    if (enrollIdFound) {
      p.error.badRequest("Enroll ID already in use");
    }

    const user = await userModel.create({
      data: {
        name,
        email,
        password: userModel.hashPassword(password),
        role: "STUDENT",
        courseId,
      },
    });

    if (!user) {
      p.error.serverError("Error creating user");
    }

    const student = await studentModel.create({
      data: {
        enrollId,
        courseId,
        userId: user.id,
      },
    });

    const resolution = await resolutionModel.findFirst({
      where: {
        courseId,
        isCurrent: true,
      },
    });

    if (!resolution) {
      p.error.serverError("Resolution not found");
    }

    if (!student) {
      p.error.serverError("Error creating student");
    }

    await studentReviewModel.create({
      data: {
        studentId: student.id,
        resolutionId: resolution.id,
      },
    });

    return student;
  },
});
