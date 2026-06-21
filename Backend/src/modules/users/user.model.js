import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: string,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: string,
      required: [true, "Email is Required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      typr: string,
      required: [true, "Password is Required"],
      trim: true,
      minlength: 8,
      maxlength: 50,
    },

    isVerified: {
      type: boolean,
      default: false,
    },

    verificationToken: { type: string, select: false },
    refreshToken: { type: string, select: false },
    resetToken: { type: string, select: false },
    resetTokenExpires: { type: string, select: false },
  },
  { timestamp: true },
);

// Now Hash the password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(password, 12);

  userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(this.password, candidatePassword);
  };
});

export default mongoose.model("User", userSchema);
