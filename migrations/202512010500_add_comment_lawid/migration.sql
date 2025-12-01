-- add optional lawId to comments
ALTER TABLE "Comment" ADD COLUMN "lawId" INTEGER;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_lawId_fkey" FOREIGN KEY ("lawId") REFERENCES "Law"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
