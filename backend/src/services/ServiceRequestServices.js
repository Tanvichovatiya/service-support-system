import ServiceRequest from "../models/ServiceRequest.js";

const ServiceRequestServices = {
  createService: async (data = {}) => {
    try {
      const service = await ServiceRequest.create(data);
      return service;
    } catch (error) {
      throw error;
    }
  },

  getDatabyId: async (id, select = "", populate = []) => {
    try {
      let query = ServiceRequest.findById(id).select(select);

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
      let query = ServiceRequest.find(filter)
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
      return await ServiceRequest.findOne(filter).select(select);
    } catch (error) {
      console.log("getdatabyfindOne error:", error);
      throw error;
    }
  },
  updateOne: async (filter = {}, update = {}) => {
    try {
      const result = await ServiceRequest.updateOne(filter, update);

      if (result.matchedCount == 0) {
        throw new Error("document not found");
      }
      return result;
    } catch (error) {
      console.log("mongoose err", error);
      throw error;
    }
  },
  deleteOne: async (filter = {}) => {
    try {
      const result = await ServiceRequest.deleteOne(filter);

      if (result.deletedCount === 0) {
        throw new Error("request not found");
      }

      return result;
    } catch (error) {
      console.log("deleteOne error:", error);
      throw error;
    }
  },
  getAggData: async (aggPipline) => {
    try {
      const data = await ServiceRequest.aggregate(aggPipline);
      return data;
    } catch (error) {
      console.log("mongoose error", error);
      throw error;
    }
  },
  countData: async (filter = {}) => {
    try {
      return await ServiceRequest.countDocuments(filter);
    } catch (error) {
      console.log("countData error:", error);
      throw error;
    }
  },
  getPendingOverdueRequests: async () => {
    try {
       const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      // const twentyFourHoursAgo = new Date(Date.now() - 3* 60 * 1000);

      const requests = await ServiceRequest.find({
        status: "pending",

        isOverdue: false,

        createdAt: {
          $lte: twentyFourHoursAgo,
        },
      }).sort({
        createdAt: 1,
      });

      return requests;
    } catch (error) {
      console.log("getPendingOverdueRequests error:", error);

      throw error;
    }
  },
};

export default ServiceRequestServices;
