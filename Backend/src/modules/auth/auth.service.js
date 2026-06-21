import crypto from "crypto";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";
import User from "../users/user.model.js";
import {
  generateVerificationToken,
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/jwt.utils.js";

import {
  sendVerificationEmail,
} from "../../common/config/email.js";

// Hash the refreshtoken before storing in DB
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ fullName, email, password }) => {
  const exist = await User.findOne({ email });
  if (exist) {
    throw ApiError.conflict("User already Exist");
  }
  const { rawToken, hashedToken } = generateVerificationToken();

  const user = await User.create({
    fullName,
    email,
    password,
    verificationToken: hashedToken,
  });

  try {
    await sendVerificationEmail(rawToken, email);
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;

  return userObj
};


const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("Invalid Email or Password");
  }

  const verifyPassword = await user.comparePassword(password);
  if (!verifyPassword) {
    throw ApiError.unauthorized("Invalid Email or Password");
  }

  if (!user.isVerified) {
    throw ApiError.unauthorized(
      "Please verify your Email but verification link",
    );
  }

  const refreshToken = generateRefreshToken({ id: user._id });
  const accessToken = generateAccessToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validationBefore: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, refreshToken, accessToken };
};

const logout = async (userId) => {
  await User.findByIdAndDelete(userId, { refreshToken: null });
};

export { register, login, logout };
