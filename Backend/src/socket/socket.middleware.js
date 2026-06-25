import { verifyAccessToken } from "../common/utils/jwt.utils.js";
import User from "../modules/users/user.model.js";

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.data.user = {
      id: user._id.toString(),
      fullName: user.name,
      email: user.email,
    };

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
