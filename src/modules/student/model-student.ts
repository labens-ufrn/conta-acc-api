import { prismaClient } from "@src/core/db/prisma";

export const studentModel = {
  ...prismaClient.student,
};
