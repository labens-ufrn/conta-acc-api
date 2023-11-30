import { prismaClient } from "@src/core/db/prisma";

export const templateModel = {
  ...prismaClient.course,
};
