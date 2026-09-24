import { userServices } from "../../services/userServices.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt"
import redisServices from "../../services/redis/redisServices.js";
import { redisKeys } from "../../utils/redisKey.js";

export const getAllUsers = async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const matchStage = {
      role: "user",
    };

    if (status === "active") {
      matchStage.isActive = true;
    }

    if (status === "inactive") {
      matchStage.isActive = false;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      matchStage.$or = [{ firstname: searchRegex }, { lastname: searchRegex }];
    }

    const aggPipeline = [
      {
        $match: matchStage,
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
        currentPage: page, // FIX
        totalPages,
        totalUsers,
        limit,

        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },

      filters: {
        search,
        status,
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
          _id: new mongoose.Types.ObjectId(id),
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

          cancelledRequests: {
            $size: {
              $filter: {
                input: "$serviceRequests",
                as: "request",
                cond: {
                  $eq: ["$$request.status", "cancelled"],
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

    // return successResponse(res, {
    //   statusCode: 200,
    //   message: "User fetched successfully",
    //   data: user,
    // });
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

    const user = await userServices.getDatabyId({
      _id: id,
      role: "user",
    });

    if (!user.isActive) {
      return errorResponse(res, {
        statusCode: 400,
        message: "User is already inactive",
      });
    }

    const updatedUser = await userServices.updateOne(
      { _id: id },
      {
        $set: {
          isActive: false,
        },
      },
    );
    await redisServices.delete(redisKeys.dashboard.stats())
    return successResponse(res, {
      statusCode: 200,
      message: "User delete successfully",
      data: updatedUser,
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
      isActive: true,

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
