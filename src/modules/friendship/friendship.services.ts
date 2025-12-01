import prisma from '../../config/prismaClient';

// Use Prisma-backed Friendship management. The Prisma model stores senderId / receiverId
export const sendRequest = async (requesterId: string | number, receiverId: string | number) => {
  const senderId = Number(requesterId);
  const receiver = Number(receiverId);

  const exists = await prisma.friendship.findFirst({
    where: {
      OR: [
        { senderId, receiverId: receiver },
        { senderId: receiver, receiverId: senderId },
      ],
    },
  });

  if (exists) return exists; // already exists

  return prisma.friendship.create({ data: { senderId, receiverId: receiver, status: 'pending' } });
};

export const accept = async (id: string | number) => {
  const iid = Number(id);
  const friendship = await prisma.friendship.update({ where: { id: iid }, data: { status: 'accepted' } });
  return friendship;
};

export const reject = async (id: string | number) => {
  const iid = Number(id);
  return prisma.friendship.update({ where: { id: iid }, data: { status: 'rejected' } });
};

export const getFriends = async (userId: string | number) => {
  const uid = Number(userId);
  const friendships = await prisma.friendship.findMany({
    where: { status: 'accepted', OR: [{ senderId: uid }, { receiverId: uid }] },
  });

  const friendIds = friendships.map((f: any) => (f.senderId === uid ? f.receiverId : f.senderId));

  if (friendIds.length === 0) return [];

  const users = await prisma.user.findMany({ where: { id: { in: friendIds } }, select: { id: true, name: true, email: true, createdAt: true } });
  return users;
};