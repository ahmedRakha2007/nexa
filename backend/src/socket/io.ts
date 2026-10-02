import type { Server } from "socket.io";

let io: Server;

export const setIO = (socketServer: Server) => {
  io = socketServer;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};