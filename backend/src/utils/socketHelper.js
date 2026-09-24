import mongoose from "mongoose";
import { MessageServices } from "../services/MessageServices.js";

export const socketHelper = {

  messageSeen: async ({ senderId, receiverId, socket, io }) => {
    try {
      const senderObjectId = new mongoose.Types.ObjectId(senderId);
      const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

      const result = await MessageServices.updateMany(
        {
          senderId: senderObjectId,
          receiverId: receiverObjectId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );


      const senderRoom =socket.user.role === "user"
          ? `staff:${senderId}`
          : `user:${senderId}`;

      io.to(senderRoom).emit("markMessageAsSeen", {
        senderId: receiverId,
        receiverId: senderId,
      });

    } catch (error) {
      console.log("socket error:", error);
    }
  },
  
};