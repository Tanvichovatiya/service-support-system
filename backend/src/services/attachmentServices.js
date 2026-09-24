
import Attachment from "../models/AttachmentSchema.js";



export const attachmentServices = {
 
  createAttachment: async (data = {}) => {
    try {
      const attachment = await Attachment.create(data);

      if (!attachment) {
        throw new Error("Attachment not created");
      }

      return attachment;
    } catch (error) {
      console.log("createAttachment error:", error);
      throw error;
    }
  },

 
  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = Attachment.findById(id).select(select);

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
      let query = Attachment.find(filter)
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
      let query = Attachment.findOne(filter).select(select);

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
      const result = await Attachment.updateOne(filter, update);

      if (result.matchedCount === 0) {
        throw new Error("Attachment not found");
      }

      return result;
    } catch (error) {
      console.log("updateOne error:", error);
      throw error;
    }
  },

  deleteOne: async (filter = {}) => {
    try {
      const result = await Attachment.deleteOne(filter);

      if (result.deletedCount === 0) {
        throw new Error("Attachment not found");
      }

      return result;
    } catch (error) {
      console.log("deleteOne error:", error);
      throw error;
    }
  },

  getAggData: async (aggPipeline = []) => {
    try {
      return await Attachment.aggregate(aggPipeline);
    } catch (error) {
      console.log("getAggData error:", error);
      throw error;
    }
  },

  countData: async (filter = {}) => {
    try {
      return await Attachment.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },
};