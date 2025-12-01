-- Migration: add debate fields from old mongoose model

-- Rename userId -> user1Id
ALTER TABLE "Debate" RENAME COLUMN "userId" TO "user1Id";

-- Add optinal second participant
ALTER TABLE "Debate" ADD COLUMN "user2Id" INTEGER;
ALTER TABLE "Debate" ADD CONSTRAINT "Debate_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add status column (text enum / keep string to be safe)
ALTER TABLE "Debate" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';

-- Add arguments arrays (text[])
ALTER TABLE "Debate" ADD COLUMN "argumentsUser1" TEXT[] DEFAULT '{}';
ALTER TABLE "Debate" ADD COLUMN "argumentsUser2" TEXT[] DEFAULT '{}';

-- Add public vote counters
ALTER TABLE "Debate" ADD COLUMN "publicVotesUser1" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Debate" ADD COLUMN "publicVotesUser2" INTEGER NOT NULL DEFAULT 0;
