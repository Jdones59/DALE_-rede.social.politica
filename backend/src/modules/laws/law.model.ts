import mongoose from 'mongoose';

const lawSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  number: { type: String, unique: true, required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true },
  votesFor: { type: Number, default: 0 },
  votesAgainst: { type: Number, default: 0 },
});

export const Law = mongoose.model('Law', lawSchema);