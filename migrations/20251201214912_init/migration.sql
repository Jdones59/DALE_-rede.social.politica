-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_debateId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_lawId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "debateId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_lawId_fkey" FOREIGN KEY ("lawId") REFERENCES "Law"("id") ON DELETE SET NULL ON UPDATE CASCADE;
