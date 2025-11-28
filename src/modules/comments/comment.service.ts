import { Comment } from './comment.model';
import { checkFriendship } from '../../utils/checkFriendship';
import { User } from '../users/user.model';

export const createComment = async (lawId: string, userId: string, text: string) => {
  const comment = new Comment({ law: lawId, user: userId, text });
  await comment.save();
  return comment;
};

export const getCommentsForLaw = async (lawId: string, viewerId: string) => {
  const comments = await Comment.find({ law: lawId }).populate('user', 'realName anonName');
  const processed = await Promise.all(comments.map(async (comment: any) => {
    const isFriend = await checkFriendship(viewerId, comment.user._id.toString());
    comment.visibleName = isFriend ? comment.user.realName : comment.user.anonName;
    delete comment.user;  // Hide user details
    return comment.toObject();  // Convert to plain object if needed
  }));
  return processed;
};