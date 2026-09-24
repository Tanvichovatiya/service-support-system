

import mongoose from "mongoose";


import staffServices from "../services/staffServcies.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { userServices } from "../services/userServices.js";
import ServiceRequestServices from "../services/serviceRequestServices.js";

//user
export const getMyRequestStaff = async (req, res) => {
  try {

    const { id: userId, role } = req.user;

    const staffIds = await ServiceRequestServices.getAggData([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          assignedStaffId: { $ne: null },
        },
      },

      {
        $group: {
          _id: "$assignedStaffId",
        },
      },
    ]);

    if (!staffIds.length) {
      return successResponse(res, {
        statusCode: 200,
        message: "No staff found for your service requests",
        data: [],
      });
    }

    const ids = staffIds.map((item) => item._id);

   
    const staffList = await staffServices.getAggData([
      {
        $match: {
          _id: { $in: ids },
        },
      },

     
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

     
      {
        $project: {
          _id: 1,
          employeeId: 1,
          department: 1,
          skills: 1,

          userId: "$user._id",
          firstname: "$user.firstname",
          lastname: "$user.lastname",
          email: "$user.email",
          profilePic: "$user.profilePic",
          gender: "$user.gender",
          isOnline: "$user.isOnline",
        },
      },

      {
        $sort: {
          firstname: 1,
        },
      },
    ]);

    return successResponse(res, {
      statusCode: 200,
      message: "Staff fetched successfully",
      data: staffList,
    });

  } catch (error) {
    console.log("getMyRequestStaff error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};


//staff
export const getMyRequestUsers = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

   

    const staff = await staffServices.getdatabyfindOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

  
    const userIds = await ServiceRequestServices.getAggData([
      {
        $match: {
          assignedStaffId: staff._id,
        },
      },

      {
        $group: {
          _id: "$userId",
        },
      },
    ]);

    if (!userIds.length) {
      return successResponse(res, {
        statusCode: 200,
        message: "No users found",
        data: [],
      });
    }

    const ids = userIds.map((item) => item._id);

    const users = await userServices.getAggData([
      {
        $match: {
          _id: {
            $in: ids,
          },
          role: "user",
        },
      },

      {
        $project: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
          profilePic: 1,
          gender: 1,
          isOnline: 1,
        },
      },

      {
        $sort: {
          firstname: 1,
        },
      },
    ]);

    return successResponse(res, {
      statusCode: 200,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("getMyRequestUsers error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};