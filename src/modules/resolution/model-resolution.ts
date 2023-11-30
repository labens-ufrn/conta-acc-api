import { prismaClient } from "@src/core/db/prisma";

export const resolutionModel = {
  ...prismaClient.resolution,
};
