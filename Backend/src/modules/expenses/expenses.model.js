import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    note: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 20,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: String,
      enum: ["Food", "Hotel", "Transport", "Shopping", "Other"],
      required: true,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shareAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Expenses", expenseSchema)