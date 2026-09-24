import { socketHelper } from "../utils/socketHelper.js";
import { getIo } from "./initSocket.js";


export const registerChatSocket = (socket) => {
  
  const io = getIo();

  socket.on("message-seen", async ({ senderId }) => {
    
    const receiverId = socket.user.id.toString();

    await socketHelper.messageSeen({
      senderId,
      receiverId,
      socket,
      io,
    });
  });
};