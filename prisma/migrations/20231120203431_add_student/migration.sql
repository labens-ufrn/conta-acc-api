/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SYSADMIN', 'ADMIN', 'COORDINATOR', 'STUDENT');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "enrollId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metaData" JSONB,
    "userId" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_enrollId_key" ON "students"("enrollId");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
