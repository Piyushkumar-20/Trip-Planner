import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expires_in: process.env.JWT_SECRET_ACCESS_EXPIRES_IN || "15m",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET_ACCESS_TOKEN);
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expires_in: process.env.JWT_SECRET_REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

const verifyRefreshToken = () => {
  return jwt.verify(token, JWT_SECRET_REFRESH_TOKEN);
};

const generateResetToken = (token) => {
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
  generateResetToken,
};
