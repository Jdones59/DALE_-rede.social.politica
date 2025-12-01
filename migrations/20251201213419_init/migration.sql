/*
  Warnings:

  - The `status` column on the `Debate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DebateStatus" AS ENUM ('pending', 'active', 'closed');

-- DropForeignKey
ALTER TABLE "Debate" DROP CONSTRAINT "Debate_user2Id_fkey";

-- AlterTable
ALTER TABLE "Debate" DROP COLUMN "status",
ADD COLUMN     "status" "DebateStatus" NOT NULL DEFAULT 'pending';

-- RenameForeignKey
ALTER TABLE "Debate" RENAME CONSTRAINT "Debate_userId_fkey" TO "Debate_user1Id_fkey";

-- AddForeignKey
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
