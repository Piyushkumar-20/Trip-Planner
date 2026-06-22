import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: process.env.JWT_SECRET_ACCESS_EXPIRES_IN || "15m",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: process.env.JWT_SECRET_REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN);
};

const generateVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateVerificationToken,
};
