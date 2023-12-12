import { prismaClient } from "@src/core/db/prisma";

export const activitiesModel = {
  ...prismaClient.activities,
};
