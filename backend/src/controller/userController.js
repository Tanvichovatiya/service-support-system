
import staffServices from "../services/staffServcies.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { userServices } from "../services/userServices.js";
import ServiceRequestServices from "../services/serviceRequestServices.js";
import { toObjectId } from "../utils/convertToObjectId.js";

export const getMyRequestStaff = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const staffList = await ServiceRequestServices.getAggData([
      {
        $match: {
          userId: toObjectId(userId),
          isDeleted: false,
          assignedStaffIds: { $exists: true, $ne: [] },
        },
      },

      {
        $unwind: "$assignedStaffIds",
      },

      {
        $group: {
          _id: "$assignedStaffIds",
        },
      },

      {
        $lookup: {
          from: "staffs",
          localField: "_id",
          foreignField: "_id",
          as: "staff",
        },
      },

      {
        $unwind: "$staff",
      },

      {
        $lookup: {
          from: "users",
          localField: "staff.userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $project: {
          _id: "$staff._id",
          // employeeId: "$staff.employeeId",
          // department: "$staff.department",
          // skills: "$staff.skills",

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
    console.log("Error fetching request staff:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};

export const getMyRequestUsers = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const users = await ServiceRequestServices.getAggData([
      {
        $match: {
          assignedStaffIds: {
            $exists: true,
            $ne: [],
          },
          isDeleted: false,
        },
      },

      {
        $unwind: "$assignedStaffIds",
      },

      {
        $lookup: {
          from: "staffs",
          localField: "assignedStaffIds",
          foreignField: "_id",
          as: "staff",
        },
      },

      {
        $unwind: "$staff",
      },

      {
        $match: {
          "staff.userId": toObjectId(userId),
        },
      },

      {
        $group: {
          _id: "$userId",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },


      {
        $project: {
          _id: "$user._id",
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
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("Error fetching request users:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};