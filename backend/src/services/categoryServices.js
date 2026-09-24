import Category from "../models/Category.js";

export const categoryServices = {
  create: async (data = {}) => {
    try {
      const category = await Category.create(data);

      if (!category) {
        throw new Error("User not created");
      }

      return category;
    } catch (error) {
      console.log(" error:", error);
      throw error;
    }
  },

  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = Category.findById(id).select(select);

      if (populate.length > 0) {
        populate.forEach((item) => {
          query = query.populate(item);
        });
      }

      return await query;
    } catch (error) {
      console.log(" error:", error);
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
      let query = Category.find(filter).select(select).sort(sort).skip(skip);

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
      return await Category.findOne(filter).select(select);
    } catch (error) {
      console.log("error:", error);
      throw error;
    }
  },

  updateOne: async (filter = {}, update = {}) => {
    try {
      const result = await Category.updateOne(filter, update);

      if (result.matchedCount === 0) {
        throw new Error(" Not found");
      }

      return result;
    } catch (error) {
      console.log("updateOne error:", error);
      throw error;
    }
  },
  deleteOne: async (filter = {}) => {
    try {
      const result = await Category.deleteOne(filter);

      if (result.deletedCount === 0) {
        throw new Error("category not found");
      }

      return result;
    } catch (error) {
      console.log("deleteOne error:", error);
      throw error;
    }
  },

  getAggData: async (aggPipeline = []) => {
    try {
      return await Category.aggregate(aggPipeline);
    } catch (error) {
      console.log("getAggData error:", error);
      throw error;
    }
  },

  countData: async (filter = {}) => {
    try {
      return await Category.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },
};
