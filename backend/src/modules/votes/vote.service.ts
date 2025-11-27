import { Vote } from './vote.model';
import { Law } from '../laws/law.model';

export const vote = async (lawId: string, userId: string, voteValue: boolean) => {
  const existing = await Vote.findOne({ law: lawId, user: userId });
  if (existing) throw new Error('Already voted');

  const voteDoc = new Vote({ law: lawId, user: userId, vote: voteValue });
  await voteDoc.save();

  // Update law votes count
  const inc = voteValue ? { votesFor: 1 } : { votesAgainst: 1 };
  await Law.findByIdAndUpdate(lawId, { $inc: inc });

  return voteDoc;
};

export const getVoteCounts = async (lawId: string) => {
  const forVotes = await Vote.countDocuments({ law: lawId, vote: true });
  const againstVotes = await Vote.countDocuments({ law: lawId, vote: false });
  return { for: forVotes, against: againstVotes };
};