import prisma from '../../config/prismaClient';

function toApiFormat(debate: any, includeParticipants = false) {
  if (!debate) return null;

  const mensagens = (debate.comments || []).map((c: any) => ({
    autor: c.user ? c.user.name : String(c.userId),
    texto: c.content,
    createdAt: c.createdAt?.toISOString?.() || null,
  }));

  // Count positive/negative votes
  const positiveVotes = (debate.votes || []).filter((v: any) => v.value > 0).length;
  const negativeVotes = (debate.votes || []).filter((v: any) => v.value < 0).length;

  // Participants: if comments exist, count unique user ids + owner
  const participantSet = new Set<number>();
  if (debate.user1Id) participantSet.add(debate.user1Id);
  if (debate.user2Id) participantSet.add(debate.user2Id);
  (debate.comments || []).forEach((c: any) => participantSet.add(c.userId));

  return {
    _id: String(debate.id),
    titulo: debate.content || (debate.law?.title ?? 'Debate'),
    descricao: debate.law?.summary ?? '',
    participantes: includeParticipants ? participantSet.size : participantSet.size,
    mensagens,
    votesFor: positiveVotes,
    votesAgainst: negativeVotes,
    raw: debate,
  };
}

export const createDebate = async (user1Id: string | number, user2Id?: string | number, lawId?: string | number, theme?: string) => {
  const userId = Number(user1Id);
  if (!Number.isFinite(userId)) throw new Error('Invalid user1 id');

  const nLawId = Number(lawId);
  if (!Number.isFinite(nLawId)) throw new Error('Invalid law id');

  // create debate in prisma
  const data: any = { content: theme || '', user1Id: userId, lawId: nLawId };
  if (user2Id !== undefined && user2Id !== null) {
    const u2 = Number(user2Id);
    if (!Number.isFinite(u2)) throw new Error('Invalid user2 id');
    data.user2Id = u2;
  }

  const debate = await prisma.debate.create({
    data,
    include: { user1: true, user2: true, law: true, comments: { include: { user: true } }, votes: true },
  });

  return toApiFormat(debate);
};

export const acceptDebate = async (id: string | number) => {
  const nid = Number(id);
  if (!Number.isFinite(nid)) throw new Error('Invalid id');

  const updated = await prisma.debate.update({
    where: { id: nid },
    data: { status: 'active' },
    include: { user1: true, user2: true, law: true, comments: { include: { user: true } }, votes: true },
  });

  return toApiFormat(updated);
};

export const addArgument = async (id: string | number, userId: string | number, argument: string) => {
  const nid = Number(id);
  const uid = Number(userId);
  if (!Number.isFinite(nid) || !Number.isFinite(uid)) throw new Error('Invalid id');

  // find debate to know which side the user is on
  const debate = await prisma.debate.findUnique({ where: { id: nid } });
  if (!debate) throw new Error('Debate not found');

  if (debate.user1Id === uid) {
    await prisma.debate.update({ where: { id: nid }, data: { argumentsUser1: { push: argument } } });
  } else if (debate.user2Id === uid) {
    await prisma.debate.update({ where: { id: nid }, data: { argumentsUser2: { push: argument } } });
  } else {
    throw new Error('Not participant');
  }

  const updated = await prisma.debate.findUnique({
    where: { id: nid },
    include: { user1: true, user2: true, law: true, comments: { include: { user: true } }, votes: true },
  });

  return toApiFormat(updated, true);
};

export const votePublic = async (id: string | number, userId: string | number, voteForUser1: boolean) => {
  const nid = Number(id);
  const uid = Number(userId);
  if (!Number.isFinite(nid) || !Number.isFinite(uid)) throw new Error('Invalid id');

  const value = voteForUser1 ? 1 : -1;

  const existing = await prisma.vote.findUnique({ where: { userId_debateId: { debateId: nid, userId: uid } } });

  if (existing) {
    if (existing.value === value) {
      // no change
    } else {
      // flip counters
      if (existing.value > 0) {
        // was for user1, now for user2
        await prisma.debate.update({ where: { id: nid }, data: { publicVotesUser1: { increment: -1 }, publicVotesUser2: { increment: 1 } } });
      } else {
        await prisma.debate.update({ where: { id: nid }, data: { publicVotesUser2: { increment: -1 }, publicVotesUser1: { increment: 1 } } });
      }

      await prisma.vote.update({ where: { id: existing.id }, data: { value } });
    }
  } else {
    // new vote
    await prisma.vote.create({ data: { debateId: nid, userId: uid, value } });
    if (voteForUser1) await prisma.debate.update({ where: { id: nid }, data: { publicVotesUser1: { increment: 1 } } });
    else await prisma.debate.update({ where: { id: nid }, data: { publicVotesUser2: { increment: 1 } } });
  }

  const debate = await prisma.debate.findUnique({
    where: { id: nid },
    include: { user1: true, user2: true, law: true, comments: { include: { user: true } }, votes: true },
  });

  return toApiFormat(debate, true);
};

export const getDebateById = async (id: string | number) => {
  const nid = Number(id);
  if (!Number.isFinite(nid)) return null;

  const debate = await prisma.debate.findUnique({
    where: { id: nid },
    include: { user1: true, user2: true, law: true, comments: { include: { user: true } }, votes: true },
  });

  return toApiFormat(debate, true);
};