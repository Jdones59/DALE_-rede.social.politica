import { Friendship } from './friendship.model';
import { User } from '../users/user.model';///../users/user.model

export const sendRequest = async (requesterId: string, receiverId: string) => {
  const friendship = new Friendship({ requester: requesterId, receiver: receiverId });
  await friendship.save();
  return friendship;
};

export const accept = async (id: string) => {
  const friendship = await Friendship.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
  if (friendship) {
    await User.findByIdAndUpdate(friendship.requester, { $addToSet: { friends: friendship.receiver } });
    await User.findByIdAndUpdate(friendship.receiver, { $addToSet: { friends: friendship.requester } });
  }
  return friendship;
};

export const reject = async (id: string) => {
  return Friendship.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
};

export const getFriends = async (userId: string) => {
  const user = await User.findById(userId).populate('friends');
  return user?.friends;
};