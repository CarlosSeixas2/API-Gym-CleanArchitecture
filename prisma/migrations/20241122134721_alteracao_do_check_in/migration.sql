/*
  Warnings:

  - You are about to drop the column `gym_id` on the `check_ins` table. All the data in the column will be lost.
  - Added the required column `gymId` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_gym_id_fkey";

-- AlterTable
ALTER TABLE "check_ins" DROP COLUMN "gym_id",
ADD COLUMN     "gymId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
