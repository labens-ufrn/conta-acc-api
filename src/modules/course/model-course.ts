import { prismaClient } from "@src/core/db/prisma";

export const courseModel = {
  ...prismaClient.course,
};
