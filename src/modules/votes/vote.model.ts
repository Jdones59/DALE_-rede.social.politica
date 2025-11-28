import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    law: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Law",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vote: {
      type: Boolean,
      required: true, // true = a favor, false = contra
    },
  },
  {
    timestamps: true,
  }
);

// Impede que o mesmo usuário vote duas vezes na mesma lei
voteSchema.index({ law: 1, user: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
