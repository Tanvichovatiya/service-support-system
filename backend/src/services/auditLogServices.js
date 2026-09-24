import AuditLog from "../models/AuditLog.js";


export const auditLogServices = {
  create: async (data = {}) => {
    try {
      const auditLog = await AuditLog.create(data);

      if (!auditLog) {
        throw new Error("User not created");
      }

      return auditLog;
    } catch (error) {
      console.log(" error:", error);
      throw error;
    }
  },

  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = AuditLog.findById(id).select(select);

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
      let query = AuditLog.find(filter).select(select).sort(sort).skip(skip);

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
      return await AuditLog.findOne(filter).select(select);
    } catch (error) {
      console.log("error:", error);
      throw error;
    }
  },

  updateOne: async (filter = {}, update = {}) => {
    try {
      const result = await AuditLog.updateOne(filter, update);

      if (result.matchedCount === 0) {
        throw new Error("auditLog Not found");
      }

      return result;
    } catch (error) {
      console.log("updateOne error:", error);
      throw error;
    }
  },
   deleteOne: async (filter = {}) => {
      try {
        const result = await AuditLog.deleteOne(filter);
  
        if (result.deletedCount === 0) {
          throw new Error("auditLog not deleted");
        }
  
        return result;
      } catch (error) {
        console.log("deleteOne error:", error);
        throw error;
      }
    },

  getAggData: async (aggPipeline = []) => {
    try {
      return await AuditLog.aggregate(aggPipeline);
    } catch (error) {
      console.log("getAggData error:", error);
      throw error;
    }
  },

  countData: async (filter = {}) => {
    try {
      return await AuditLog.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },

};