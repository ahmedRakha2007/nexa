
import { Server } from "socket.io";
import { registerChatHandlers } from "./chat.socket.ts";
import { socketAuth } from "./socketAuth.ts";
import { setIO } from "./io.ts";

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: [
    "http://localhost:8080",
    "https://nexa-1-jh4m.onrender.com",
  ],
    },
  });

  setIO(io);

 io.use(socketAuth);

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId}`);
    console.log("User joined room:", `user:${socket.data.userId}`);
    registerChatHandlers(io, socket);
  });

  return io;
};