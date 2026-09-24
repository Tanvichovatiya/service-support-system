import { Server } from "socket.io";
import { socketAuth } from "../middleware/SocketAuth.js";
import { setUserOffline, setUserOnline } from "../utils/userOnlineHelper.js";
import {registerChatSocket} from "./registerChatSocket.js"

let io;

export const initSocket = (server) => {
  
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", async (socket) => {
    const userId = socket.user.id.toString();
    const role = socket.user.role;

    console.log(`Socket connected: ${role} - ${userId}`);

    await setUserOnline(userId);
    if (role === "admin") {
      socket.join("admins");
    }

    if (role === "staff") {
      socket.join(`staff:${userId}`);
    }

    if (role === "user") {
      socket.join(`user:${userId}`);
    }
    
    registerChatSocket(socket)

    socket.on("disconnect", async() => {
      console.log(`Socket disconnected: ${role} - ${userId}`);
      await setUserOffline(userId)
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  return io;
};
