import { Debate } from './debate.module';

export const createDebate = async (user1Id: string, user2Id: string, lawId?: string, theme?: string) => {
  const debate = new Debate({ user1: user1Id, user2: user2Id, law: lawId, theme });
  await debate.save();
  return debate;
};

export const acceptDebate = async (id: string) => {
  return Debate.findByIdAndUpdate(id, { status: 'active' }, { new: true });
};

export const addArgument = async (id: string, userId: string, argument: string) => {
  const debate = await Debate.findById(id);
  if (!debate) throw new Error('Debate not found');
  if (debate.user1.toString() === userId) {
    debate.argumentsUser1.push(argument);
  } else if (debate.user2.toString() === userId) {
    debate.argumentsUser2.push(argument);
  } else {
    throw new Error('Not participant');
  }
  await debate.save();
  return debate;
};

export const votePublic = async (id: string, voteForUser1: boolean) => {
  const inc = voteForUser1 ? { publicVotesUser1: 1 } : { publicVotesUser2: 1 };
  return Debate.findByIdAndUpdate(id, { $inc: inc }, { new: true });
};

export const getDebateById = async (id: string) => {
  return Debate.findById(id).populate('law user1 user2');
};