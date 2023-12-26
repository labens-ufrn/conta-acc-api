import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const sysadmin = await prisma.user.upsert({
    where: { email: "sysadmin@mail.com" },
    update: {},
    create: {
      email: "sysadmin@mail.com",
      name: "Sysadmin",
      role: "SYSADMIN",
      password: hashSync("Senha@123", 10),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
