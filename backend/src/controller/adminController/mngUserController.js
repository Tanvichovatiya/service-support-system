import { userServices } from "../../services/userServices.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt"
import redisServices from "../../services/redis/redisServices.js";
import { redisKeys } from "../../utils/redisKey.js";
import { buildRegexSearch, getPagination } from "../../utils/queryHelper.js";
import { toObjectId } from "../../utils/convertToObjectId.js";

export const getAllUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;
   
    const { page, limit, skip } = getPagination(req.query, 6);

    const matchStage ={ role:"user",isDeleted:false}
  
    const searchStage = buildRegexSearch(search, ["firstname", "lastname"]);

    if (searchStage) {
      Object.assign(matchStage, searchStage);
    }
   
    const aggPipeline = [
      {
        $match:matchStage
      },

      {
        $lookup: {
          from: "servicerequests",
          localField: "_id",
          foreignField: "userId",
          as: "serviceRequests",
        },
      },

      {
        $addFields: {
          totalServiceRequests: {
            $size: "$serviceRequests",
          },
        },
      },

      {
        $project: {
          password: 0,
          passwordSetupToken: 0,
          passwordSetupExpires: 0,
          serviceRequests: 0,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $facet: {
          users: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],

          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result = await userServices.getAggData(aggPipeline);

    const users = result[0]?.users || [];
    const totalUsers = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalUsers / limit);

    return res.render("admin/user/index", {
      users,

      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },

      filters: {
        search,
      },
    });
  } catch (error) {
    console.log("getUsers error:", error);

    return res.status(500).send("Unable to load users");
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const aggPipeline = [
      {
        $match: {
          _id: toObjectId(id),
          role: "user",
        },
      },

      {
        $lookup: {
          from: "servicerequests",
          localField: "_id",
          foreignField: "userId",
          as: "serviceRequests",
        },
      },

      {
        $addFields: {
          totalServiceRequests: {
            $size: "$serviceRequests",
          },
        },
      },

      {
        $addFields: {
          pendingRequests: {
            $size: {
              $filter: {
                input: "$serviceRequests",
                as: "request",
                cond: {
                  $eq: ["$$request.status", "pending"],
                },
              },
            },
          },

          assignedRequests: {
            $size: {
              $filter: {
                input: "$serviceRequests",
                as: "request",
                cond: {
                  $eq: ["$$request.status", "assigned"],
                },
              },
            },
          },

          inProgressRequests: {
            $size: {
              $filter: {
                input: "$serviceRequests",
                as: "request",
                cond: {
                  $eq: ["$$request.status", "in_progress"],
                },
              },
            },
          },

          completedRequests: {
            $size: {
              $filter: {
                input: "$serviceRequests",
                as: "request",
                cond: {
                  $eq: ["$$request.status", "completed"],
                },
              },
            },
          },

        },
      },

      {
        $project: {
          password: 0,
          passwordSetupToken: 0,
          passwordSetupExpires: 0,
        },
      },
    ];

    const result = await userServices.getAggData(aggPipeline);

    const user = result[0];

    return res.render("admin/user/singleuser", { data: user });
  } catch (error) {
    console.log("getUserById error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server Error",
      errors: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

  

     await userServices.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      },
    );
    await redisServices.delete(redisKeys.dashboard.stats())
    return successResponse(res, {
      statusCode: 200,
      message: "User delete successfully",
    
    });
  } catch (error) {
    console.log("deleteUser error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server Err",
      errors: error.message,
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const { firstname, lastname, email, gender } = req.body;

    const existingUser = await userServices.getdatabyfindOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const randomPassword = crypto.randomBytes(8).toString("hex");

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await userServices.createUser({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      gender,
      role: "user",

      isEmailVerified: true,
     

      passwordSetupToken: null,
      passwordSetupExpires: null,
    });
     await redisServices.delete(redisKeys.dashboard.stats())

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        gender: user.gender,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Add User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};
