import prisma from '../config/prismaClient';

export const checkFriendship = async (user1Id: string | number, user2Id: string | number) => {
  const u1 = Number(user1Id);
  const u2 = Number(user2Id);

  const f = await prisma.friendship.findFirst({
    where: {
      status: 'accepted',
      OR: [
        { senderId: u1, receiverId: u2 },
        { senderId: u2, receiverId: u1 },
      ],
    },
  });

  return !!f;
};