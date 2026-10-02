import { getIO } from "./io.ts";

export const sendNotification = (
  receiverId: string,
  notification: unknown
) => {
  const io = getIO();

  io.to(`user:${receiverId}`).emit(
    "notification:new",
    notification
  );
};