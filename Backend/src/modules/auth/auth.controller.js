import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, "Account Created Succesfully!", user);
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, cookieOptions);
  ApiResponse.ok(res, "Login Successfull!", { user, accessToken });
};

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(token);

  res.cookie("refreshToken", newRefreshToken, cookieOptions);

  ApiResponse.ok(res, "Refreshed Token", { accessToken });
};

const verifyEmail = async (req, res) => {
  await authService.verifyEmail(req.params.token);
  ApiResponse.ok(res, "Email verified");
};

const logout = async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie("refreshToken", cookieOptions);
  ApiResponse.ok(res, "Logged Out!");
};

const forgetPassword = async (req, res) => {
  await authService.forgetPassword(req.body.email);
  ApiResponse.ok(res, "Reset Password email has been sent");
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  ApiResponse.ok(res, "Password Reset Successfully");
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "User profile", user);
};

export {
  register,
  login,
  refreshToken,
  logout,
  forgetPassword,
  verifyEmail,
  resetPassword,
  getMe,
};
