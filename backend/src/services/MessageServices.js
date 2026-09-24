import Message from "../models/Message.js";

export const MessageServices = {
  // -----------------------------------------
  // CREATE MESSAGE
  // -----------------------------------------
  createData: async (data = {}) => {
    try {
      const message = await Message.create(data);

      if (!message) {
        throw new Error("Message not created");
      }

      return message;
    } catch (error) {
      console.log("createData error:", error);
      throw error;
    }
  },

  // -----------------------------------------
  // GET MESSAGE BY ID
  // -----------------------------------------
  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = Message.findById(id).select(select);

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

  // -----------------------------------------
  // GET MESSAGES
  // -----------------------------------------
  getData: async (
    filter = {},
    select = "",
    populate = [],
    sort = {},
    skip = 0,
    limit = 0
  ) => {
    try {
      let query = Message.find(filter)
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

  // -----------------------------------------
  // FIND ONE
  // -----------------------------------------
  getdatabyfindOne: async (
    filter = {},
    select = "",
    populate = []
  ) => {
    try {
      let query = Message.findOne(filter).select(select);

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

  // -----------------------------------------
  // UPDATE ONE
  // -----------------------------------------
  updateOne: async (filter = {}, update = {}) => {
    try {
      const result = await Message.updateOne(filter, update);

      if (result.matchedCount === 0) {
        throw new Error("Message not found");
      }

      return result;
    } catch (error) {
      console.log("updateOne error:", error);
      throw error;
    }
  },

  // -----------------------------------------
  // UPDATE MANY
  // -----------------------------------------
  updateMany: async (filter = {}, update = {}) => {
    try {
      return await Message.updateMany(filter, update);
    } catch (error) {
      console.log("updateMany error:", error);
      throw error;
    }
  },

  // -----------------------------------------
  // DELETE ONE
  // -----------------------------------------
  deleteOne: async (filter = {}) => {
    try {
      const result = await Message.deleteOne(filter);

      if (result.deletedCount === 0) {
        throw new Error("Message not found");
      }

      return result;
    } catch (error) {
      console.log("deleteOne error:", error);
      throw error;
    }
  },

  // -----------------------------------------
  // COUNT
  // -----------------------------------------
  countData: async (filter = {}) => {
    try {
      return await Message.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },

  // -----------------------------------------
  // AGGREGATION
  // -----------------------------------------
  getAggData: async (aggPipeline = []) => {
    try {
      return await Message.aggregate(aggPipeline);
    } catch (error) {
      console.log("getAggData error:", error);
      throw error;
    }
  },
};