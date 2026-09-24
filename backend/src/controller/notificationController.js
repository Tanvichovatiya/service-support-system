import notificationServices from "../services/notificationServices.js";

import mongoose from "mongoose";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { redisKeys } from "../utils/redisKey.js";
import redisServices from "../services/redis/redisServices.js";

export const getUnreadNotifications = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const receiverId = new mongoose.Types.ObjectId(userId);

    const match = {
      receiverId,
      isRead: false,
    };

    const notifications = await notificationServices.getAggData([
      {
        $match: match,
      },

      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },

      {
        $unwind: {
          path: "$sender",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,

          receiverId: 1,
          senderId: 1,
          requestId: 1,

          type: 1,
          message: 1,
          actions: 1,

          isRead: 1,
          readAt: 1,

          createdAt: 1,
          updatedAt: 1,

          "sender._id": 1,
          "sender.firstname": 1,
          "sender.lastname": 1,
          "sender.email": 1,
          "sender.profilePic": 1,
          "sender.role": 1,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limitNumber,
      },
    ]);
    // console.log("unreadnotfications:", notifications);

    const total = await notificationServices.countUnread(userId);

    return successResponse(res, {
      statusCode: 200,
      message: "Unread notifications fetched successfully",
      data: {
        notifications,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    console.log("getUnreadNotifications error:", error);
    return errorResponse(res, {
      statusCode: 500,
      message: "Server Err",
      errors: error.message,
    });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const redisKey = redisKeys.notification.unreadCount(userId);

    let unreadCount = await redisServices.get(redisKey);
    // console.log("unreadCount:",unreadCount)

    if (unreadCount === null) {
      unreadCount = await notificationServices.countUnread(userId);

      await redisServices.set(redisKey, unreadCount);
    }
    // let unreadCount = await notificationServices.countUnread(userId);
    return successResponse(res, {
      statusCode: 200,
      message: "Unread count fetched successfully",
      data: {
        unreadCount: Number(unreadCount),
      },
    });
  } catch (error) {
    console.log("getUnreadNotificationCount error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server Err",
      errors: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { notificationId } = req.params;

    const notification = await notificationServices.markAsRead(
      notificationId,
      userId,
    );

    if (!notification) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Unread notification not found.",
      });
    }

    const unreadCount = await notificationServices.countUnread(userId);

    const redisKey = redisKeys.notification.unreadCount(userId);

    await redisServices.set(redisKey, unreadCount);

    return successResponse(res, {
      statusCode: 200,
      message: "Notification marked as read successfully",
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.log("markNotificationAsRead error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server Err",
      errors: error.message,
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await notificationServices.markAllAsRead(userId);

    const redisKey = redisKeys.notification.unreadCount(userId);

    await redisServices.set(redisKey, 0);

    return successResponse(res, {
      statusCode: 200,
      message: "All notifications marked as read successfully",
      data: {
        modifiedCount: result.modifiedCount,
        unreadCount: 0,
      },
    });
  } catch (error) {
    console.log("markAllNotificationsAsRead error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server Err",
      errors: error.message,
    });
  }
};
