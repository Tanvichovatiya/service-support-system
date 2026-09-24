import User from "../models/User.js";

export const userServices = {
  createUser: async (data = {}) => {
    try {
      const user = await User.create(data);

      if (!user) {
        throw new Error("User not created");
      }

      return user;
    } catch (error) {
      console.log("createUser error:", error);
      throw error;
    }
  },

  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = User.findById(id).select(select);

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
    sort = {},
    skip = 0,
    limit = 0
  ) => {
    try {
      let query = User.find(filter)
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

  getdatabyfindOne: async (filter = {}, select = "") => {
    try {
      return await User.findOne(filter).select(select);
    } catch (error) {
      console.log("getdatabyfindOne error:", error);
      throw error;
    }
  },

  updateOne: async (filter = {}, update = {}) => {
    try {
      const result = await User.updateOne(filter, update);

      if (result.matchedCount === 0) {
        throw new Error("User not found");
      }

      return result;
    } catch (error) {
      console.log("updateOne error:", error);
      throw error;
    }
  },
   deleteOne: async (filter = {}) => {
      try {
        const result = await User.deleteOne(filter);
  
        if (result.deletedCount === 0) {
          throw new Error("Staff not found");
        }
  
        return result;
      } catch (error) {
        console.log("deleteOne error:", error);
        throw error;
      }
    },

  getAggData: async (aggPipeline = []) => {
    try {
      return await User.aggregate(aggPipeline);
    } catch (error) {
      console.log("getAggData error:", error);
      throw error;
    }
  },

  countData: async (filter = {}) => {
    try {
      return await User.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },

};