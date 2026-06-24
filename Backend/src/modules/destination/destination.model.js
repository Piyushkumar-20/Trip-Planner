import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },

  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 5,
    maxlength: 50,
  },

  description: {
    type: String,
    trim: true,
    required: true,
    minlength: 10,
    maxlength: 300,
  },

  visitDate: {
    type: Date,
    required: true,
  },

  visitTime: {
    type: String,
    required: true,
  },

  estimatedCost: {
    type: String,
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

destinationSchema.index({ tripId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Destination", destinationSchema);
