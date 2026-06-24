import crypto from "crypto";
import ApiError from "../../common/utils/api-error.js";
import User from "../users/user.model.js";
import {
  generateVerificationToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";

import {
  sendVerificationEmail,
  sendResetPasswordEmail,
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
    verificationToken: hashedToken, // DB stores the HASH
  });

  try {
    await sendVerificationEmail(rawToken, email); // Email gets the RAW token
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;

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

  // if (!user.isVerified) {
  //   throw ApiError.unauthorized(
  //     "Please verify your Email but verification link",
  //   );
  // }

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

/* When a user registers, they get an email with a verification link containing a raw token. 
This function validates that token and marks the account as verified. */
const verifyEmail = async (token) => {
  const trimmed = String(token).trim();

  if (!trimmed) {
    throw ApiError.unauthorized("Invalid or expired verification token");
  }

  const hashedToken = hashToken(trimmed); // hash what the user sent in register()
  let user = await User
    .findOne({ verificationToken: hashedToken })
    .select("+verificationToken");

  // For developers testing in postman or api testing
  if (!user) {
    user = await User
      .findOne({ verificationToken: trimmed })
      .select("verificationToken");
  }

  if (!user) {
    throw ApiError.unauthorized("Invalid or expired verification token");
  }

  // update the user verified and remove verficationToken from DB
  await User.findByIdAndUpdate(user._id, {
    $set: { isVerified: true },
    $unset: { verificationToken: 1 },
  });
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
    await sendResetPasswordEmail(rawToken, email);
  } catch (error) {
    console.error("Failed to send reset email:", error.message);
  }
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = hashToken(token);

  const user = await User
    .findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    })
    .select("+resetPasswordToken +resetPasswordTokenExpires");

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

export {
  register,
  login,
  refresh,
  verifyEmail,
  logout,
  forgetPassword,
  resetPassword,
  getMe
};
