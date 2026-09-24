import Notification from "../models/Notification.js";
import { redisKeys } from "../utils/redisKey.js";
import redisServices from "./redis/redisServices.js";

const notificationServices = {

  createNotification: async (data = {}) => {
    try {
      const notification = await Notification.create(data);

      const unreadCount = await Notification.countDocuments({
        receiverId: data.receiverId,
        isRead: false,
      });

      const redisKey = redisKeys.notification.unreadCount(
        data.receiverId.toString(),
      );

      await redisServices.set(redisKey, unreadCount);
      //  console.log(unreadCount,redisKey)
      return {
        notification,
        unreadCount,
      };
    } catch (error) {
      console.log("createNotification error:", error);
      throw error;
    }
  },

  createManyNotifications: async (data = []) => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      const notifications = await Notification.insertMany(data);

      return notifications;
    } catch (error) {
      console.log("createManyNotifications error:", error);
      throw error;
    }
  },

  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = Notification.findById(id).select(select);

      if (populate.length > 0) {
        populate.forEach((item) => {
          query = query.populate(item);
        });
      }

      return await query;
    } catch (error) {
      console.log("getDatabyId error:", error);
      throw error;
    }
  },

  getData: async (
    filter = {},
    select = "",
    populate = [],
    sort = { createdAt: -1 },
    skip = 0,
    limit = 0,
  ) => {
    try {
      let query = Notification.find(filter)
        .select(select)
        .sort(sort)
        .skip(skip);

      if (limit > 0) {
        query = query.limit(limit);
      }

      if (populate.length > 0) {
        populate.forEach((item) => {
          query = query.populate(item);
        });
      }

      return await query;
    } catch (error) {
      console.log("getData error:", error);
      throw error;
    }
  },

  getdatabyfindOne: async (filter = {}, select = "", populate = []) => {
    try {
      let query = Notification.findOne(filter).select(select);

      if (populate.length > 0) {
        populate.forEach((item) => {
          query = query.populate(item);
        });
      }

      return await query;
    } catch (error) {
      console.log("getdatabyfindOne error:", error);
      throw error;
    }
  },

  updateOne: async (filter = {}, update = {}) => {
    try {
      const result = await Notification.updateOne(filter, update);

      if (result.matchedCount === 0) {
        throw new Error("Notification not found");
      }

      return result;
    } catch (error) {
      console.log("updateOne error:", error);
      throw error;
    }
  },

  markAsRead: async (notificationId, receiverId) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          receiverId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
        {
          new: true,
        },
      );

      return notification;
    } catch (error) {
      console.log("markAsRead error:", error);
      throw error;
    }
  },

  markAllAsRead: async (receiverId) => {
    try {
      const result = await Notification.updateMany(
        {
          receiverId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
      );

      return result;
    } catch (error) {
      console.log("markAllAsRead error:", error);
      throw error;
    }
  },

  countData: async (filter = {}) => {
    try {
      return await Notification.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },

  countUnread: async (receiverId) => {
    try {
      return await Notification.countDocuments({
        receiverId,
        isRead: false,
      });
    } catch (error) {
      console.log("countUnread error:", error);
      throw error;
    }
  },

  deleteOne: async (filter = {}) => {
    try {
      const result = await Notification.deleteOne(filter);

      if (result.deletedCount === 0) {
        throw new Error("Notification not found");
      }

      return result;
    } catch (error) {
      console.log("deleteOne error:", error);
      throw error;
    }
  },

  deleteMany: async (filter = {}) => {
    try {
      return await Notification.deleteMany(filter);
    } catch (error) {
      console.log("deleteMany error:", error);
      throw error;
    }
  },
  getAggData: async (aggPipeline = []) => {
    try {
      return await Notification.aggregate(aggPipeline);
    } catch (error) {
      console.log("getAggData error:", error);
      throw error;
    }
  },
};

export default notificationServices;
