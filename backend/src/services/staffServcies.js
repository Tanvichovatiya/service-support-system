import Staff from "../models/Staff.js";

const staffServices = {
  createStaff: async (data = {}) => {
    try {
      const staff = await Staff.create(data);
      return staff;
    } catch (error) {
      console.log("mongoose err");
      throw error;
    }
  },

  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = Staff.findById(id).select(select);

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
    limit = 0,
  ) => {
    try {
      let query = Staff.find(filter).select(select).sort(sort).skip(skip);

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
      return await Staff.findOne(filter).select(select);
    } catch (error) {
      console.log("getdatabyfindOne error:", error);
      throw error;
    }
  },

  updateOne: async (filter = {}, update = {}) => {
    try {
      const result = await Staff.updateOne(filter, update);

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
      const result = await Staff.deleteOne(filter);

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
      return await Staff.aggregate(aggPipeline);
    } catch (error) {
      console.log("getAggData error:", error);
      throw error;
    }
  },

  countData: async (filter = {}) => {
    try {
      return await Staff.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },
};

export default staffServices;
