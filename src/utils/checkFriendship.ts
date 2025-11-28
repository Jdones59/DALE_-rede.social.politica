import { User } from '../modules/users/user.model';

export const checkFriendship = async (user1Id: string, user2Id: string) => {
  const user1 = await User.findById(user1Id);
  return user1?.friends.includes(user2Id as any);
};