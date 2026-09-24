import Comment from "../models/Comment.js";


export const commentServices = {
  create: async (data = {}) => {
    try {
      const comment = await Comment.create(data);

      if (!comment) {
        throw new Error("comment not created");
      }

      return comment;
    } catch (error) {
      console.log(" error:", error);
      throw error;
    }
  },

  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = Comment.findById(id).select(select);

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
    limit = 0
  ) => {
    try {
      let query = Comment.find(filter).select(select).sort(sort).skip(skip);

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
      return await Comment.findOne(filter).select(select);
    } catch (error) {
      console.log("error:", error);
      throw error;
    }
  },

  updateOne: async (filter = {}, update = {}) => {
    try {
      const result = await Comment.updateOne(filter, update);

      if (result.matchedCount === 0) {
        throw new Error("comment Not found");
      }

      return result;
    } catch (error) {
      console.log("updateOne error:", error);
      throw error;
    }
  },
   deleteOne: async (filter = {}) => {
      try {
        const result = await Comment.deleteOne(filter);
  
        if (result.deletedCount === 0) {
          throw new Error("failed to delete");
        }
  
        return result;
      } catch (error) {
        console.log("deleteOne error:", error);
        throw error;
      }
    },

  getAggData: async (aggPipeline = []) => {
    try {
      return await Comment.aggregate(aggPipeline);
    } catch (error) {
      console.log("getAggData error:", error);
      throw error;
    }
  },

  countData: async (filter = {}) => {
    try {
      return await Comment.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },

};