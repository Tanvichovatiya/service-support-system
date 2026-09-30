import notificationServices from "../services/notificationServices.js";

import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { redisKeys } from "../utils/redisKey.js";
import redisServices from "../services/redis/redisServices.js";
import { getPagination } from "../utils/queryHelper.js";
import { toObjectId } from "../utils/convertToObjectId.js";

export const getUnreadNotifications = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { page, skip, limit } = getPagination(req.query, 10);


    const notifications = await notificationServices.getAggData([
      {
        $match: {
          receiverId: toObjectId(userId),
          isRead: false,
        },
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
          // actions: 1,

          isRead: 1,
          readAt: 1,

          createdAt: 1,
          updatedAt: 1,

          "sender._id": 1,
          "sender.firstname": 1,
          "sender.lastname": 1,
          "sender.profilePic": 1,
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
        $limit: limit,
      },
    ]);

    const total = await notificationServices.countUnread(userId);

    return successResponse(res, {
      statusCode: 200,
      message: "Unread notifications fetched successfully",
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
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
  
    if (unreadCount === null) {
      unreadCount = await notificationServices.countUnread(userId);

      await redisServices.set(redisKey, unreadCount);
    }
    
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

    await notificationServices.markAsRead(
      notificationId,
      userId,
    );

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
        unreadCount: 0,
      },
    });

  } catch (error) {
    console.log("error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server Err",
      errors: error.message,
    });
  }
};
