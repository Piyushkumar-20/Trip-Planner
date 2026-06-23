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
      role: ["Owner", "Editor", "Viewer"],
      default: "Viewer",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Member", memberSchema);
