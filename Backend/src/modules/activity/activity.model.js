import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },

    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },

    description: {
      type: String,
      trim: true,
      required: false,
      minlength: 10,
      maxlength: 300,
    },

    visitDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

    estimatedCost: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Activity", activitySchema);
