import crypto from "crypto";
import ApiError from "../../common/utils/api-error.js";
import User from "../users/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";

import {
  sendResetPasswordEmail,
} from "../../common/config/email.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Hash the refreshtoken before storing in DB
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ fullName, email, password }) => {
  const exist = await User.findOne({ email });
  if (exist) {
    throw ApiError.conflict("User already Exist");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
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

  const refreshToken = generateRefreshToken({ id: user._id });
  const accessToken = generateAccessToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, refreshToken, accessToken };
};

/* JWTs are stateless. Once issued, there's no way to revoke them — they're valid until they expire.
so we asign a Accesstoken for less time and refresh time just generate new access token. 
So that user do not have to login in every 15 min 
*/
const refresh = async (token) => {
  if (!token) {
    throw ApiError.unauthorized("Invalid Token");
  }

  const decoded = verifyRefreshToken(token);

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) {
    throw ApiError.unauthorized("User no longer Exist");
  }

  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid Token");
  }

  const newRefreshToken = generateRefreshToken({ id: user._id });
  const accessToken = generateAccessToken({ id: user._id });

  user.refreshToken = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const forgetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.unauthorized("User does not exist");
  }

  const { rawToken, hashedToken } = generateVerificationToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordTokenExpires = Date.now() + 15 * 60 * 1000; // expires in 15 min
  await user.save();

  try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (error) {
    console.error("Failed to send reset email:", error.message);
  }
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordTokenExpires");

  if (!user) {
    throw ApiError.unauthorized("No User found");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;

  await user.save();
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.unauthorized("User does not exist");
  }
  return user;
};

const googleLogin = async ({ idToken }) => {
  let payload;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch {
    throw ApiError.unauthorized("Invalid Google token");
  }

  const {
    sub: googleId,
    email,
    name,
    picture,
    email_verified,
  } = payload;

  if (!email_verified) {
    throw ApiError.unauthorized("Google email is not verified");
  }

  let user = await User.findOne({ email }).select("+refreshToken");

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");

    user = await User.create({
      fullName: name,
      email,
      password: randomPassword,
      provider: "google",
      googleId,
      avatar: picture,
    });
  } else if (!user.provider || user.provider === "local") {
    user.provider = "google";
    user.googleId = googleId;
    user.avatar = picture;

    await user.save({ validateBeforeSave: false });
  }

  const refreshToken = generateRefreshToken({ id: user._id });
  const accessToken = generateAccessToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);

  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};
export {
  register,
  login,
  googleLogin,
  refresh,
  logout,
  forgetPassword,
  resetPassword,
  getMe,
};
