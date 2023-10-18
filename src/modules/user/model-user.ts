import { prismaClient } from "@src/core/db/prisma";
import { hashSync, compareSync } from "bcrypt";

const comparePassword = (password: string, hashed: string) => {
  return compareSync(password, hashed);
};

const hashPassword = (password: string) => {
  return hashSync(password, 10);
};

export const userModel = {
  ...prismaClient.user,
  comparePassword,
  hashPassword,
};
