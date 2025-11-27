import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  law: { type: mongoose.Schema.Types.ObjectId, ref: 'Law' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model('Comment', commentSchema);