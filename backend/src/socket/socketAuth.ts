import { verifyToken } from "../utils/jwt.ts";

export const socketAuth = (socket: any, next: any) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const payload = verifyToken(token);

    socket.data.userId = payload.userId;

    next();
  } catch {
    next(new Error("Invalid or expired access token"));
  }
};