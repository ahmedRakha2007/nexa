import { io } from "socket.io-client";

const token = localStorage.getItem("nexa.token");

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  auth: {
    token,
  },
});

export default socket;
