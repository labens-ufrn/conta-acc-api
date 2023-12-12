import { prismaClient } from "@src/core/db/prisma";

export const departmentModel = {
  ...prismaClient.departament,
};
