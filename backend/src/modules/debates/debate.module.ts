import mongoose from 'mongoose';

const debateSchema = new mongoose.Schema({
  law: { type: mongoose.Schema.Types.ObjectId, ref: 'Law', required: false },
  theme: String,
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  argumentsUser1: [String],
  argumentsUser2: [String],
  status: { type: String, enum: ['pending', 'active', 'closed'], default: 'pending' },
  publicVotesUser1: { type: Number, default: 0 },
  publicVotesUser2: { type: Number, default: 0 },
});

export const Debate = mongoose.model('Debate', debateSchema);