import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema(
  {
    checklistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checklist",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 50,
      required: true
    },

    completed: {
      type: Boolean,
      default: false,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ChecklistItem", checklistItemSchema);
