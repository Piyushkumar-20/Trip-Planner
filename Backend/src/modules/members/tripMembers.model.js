import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Owner", "Editor", "Viewer"],
      default: "Viewer",
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate membership records for the same user+trip
memberSchema.index({ tripId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Member", memberSchema);
