import { prismaClient } from "@src/core/db/prisma";

export const categoryModel = {
  ...prismaClient.categories,
};
