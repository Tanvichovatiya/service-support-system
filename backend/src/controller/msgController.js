import mongoose from "mongoose";
import path from "path";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { getIo } from "../socket/initSocket.js";
import { attachmentServices } from "../services/attachmentServices.js";
import { MessageServices } from "../services/MessageServices.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: senderId, role } = req.user;
    const { receiverId } = req.params;
    const { message } = req.body;

    let attachmentIds = [];

    if (req.file) {
      const attachment = await attachmentServices.createAttachment({
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: `/uploads/messages/${req.file.filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });

      attachmentIds.push(attachment._id);
    }

    const trimmedMessage = message?.trim() || "";

    const newMessage = await MessageServices.createData({
      senderId,
      receiverId,
      message: trimmedMessage,
      attachments: attachmentIds,
    });

    const result = await MessageServices.getAggData([
      {
        $match: {
          _id: newMessage._id,
        },
      },

      {
        $lookup: {
          from: "attachments",
          localField: "attachments",
          foreignField: "_id",
          as: "attachments",
        },
      },

      {
        $project: {
          _id: 1,
          message: 1,
          isRead: 1,
          createdAt: 1,

          senderId: 1,

          receiverId: 1,

          attachments: {
            _id: 1,
            originalName: 1,
            fileName: 1,
            filePath: 1,
            mimeType: 1,
            size: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    const populatedMessage = result[0];

    const io = getIo();

    let receiverRoom;

    if (role === "user") {
      receiverRoom = `staff:${receiverId}`;
    }

    if (role === "staff") {
      receiverRoom = `user:${receiverId}`;
    }

    io.to(receiverRoom).emit("receive-message", populatedMessage);

 
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
export const loadMessage = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { receiverId } = req.params;

    // console.log("loadmsg receiverId:", receiverId, role);

    const currentUserId = new mongoose.Types.ObjectId(userId);
    const otherUserId = new mongoose.Types.ObjectId(receiverId);

   
    await MessageServices.updateMany(
      {
        senderId: otherUserId,
        receiverId: currentUserId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    
    const messages = await MessageServices.getAggData([
      {
        $match: {
          $or: [
            {
              senderId: currentUserId,
              receiverId: otherUserId,
            },
            {
              senderId: otherUserId,
              receiverId: currentUserId,
            },
          ],
        },
      },

      {
        $lookup: {
          from: "attachments",
          localField: "attachments",
          foreignField: "_id",
          as: "attachments",
        },
      },

      {
        $project: {
          _id: 1,
          senderId: 1,
          receiverId: 1,
          message: 1,
          isRead: 1,
          createdAt: 1,

          attachments: {
            _id: 1,
            originalName: 1,
            fileName: 1,
            filePath: 1,
            mimeType: 1,
            size: 1,
          },
        },
      },

      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

   
    const io = getIo();

    let senderRoom;

    if (role === "user") {
      senderRoom = `staff:${receiverId}`;
    } else if (role === "staff") {
      senderRoom = `user:${receiverId}`;
    }

   

    if (senderRoom) {
      io.to(senderRoom).emit("markMessageAsSeen", {
        senderId: userId,
        receiverId: receiverId,
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Messages loaded successfully.",
      data: {
        messages,
        curuser: userId,
      },
    });

  } catch (error) {
    console.log("loadMessage error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to load messages.",
      errors: error.message,
    });
  }
};

export const getUnReadMsg = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const unreadMessages = await MessageServices.getAggData([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(userId),
          isRead: false,
        },
      },

      {
        $group: {
          _id: "$senderId",
          unreadCount: { $sum: 1 },
        },
      },

      {
        $project: {
          _id: 0,
          senderId: "$_id",
          unreadCount: 1,
        },
      },
    ]);

    const totalUnread = unreadMessages.reduce(
      (total, item) => total + item.unreadCount,
      0,
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Unread messages fetched successfully",
      data: {
        totalUnread,
        unreadCounts: unreadMessages,
      },
    });
  } catch (error) {
    console.log(" error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server Error",
      errors: error.message,
    });
  }
};
