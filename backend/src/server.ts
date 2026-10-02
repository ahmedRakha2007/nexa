import http from "http";
import app from "./app.ts";
import { env } from "./config/env.ts";
import { initializeSocket } from "./socket/socket.ts";

const server = http.createServer(app);

initializeSocket(server);

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});