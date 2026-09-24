import crypto from "crypto";

import env from "../../config/env.js";
import { userServices } from "../../services/userServices.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import staffServices from "../../services/staffServcies.js";
import { hasheValue } from "../../utils/hashValue.js";
import { sendStaffInvitationMail } from "../../utils/sendStaffInvitationMail.js";
import { pipeline } from "stream";
import { renderServerError } from "../../utils/ejsResponse.js";
import mongoose from "mongoose";
import { auditLogServices } from "../../services/auditLogServices.js";
import redisServices from "../../services/redis/redisServices.js";
import { redisKeys } from "../../utils/redisKey.js";

export const getStaff = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();
    const isOnline = req.query.isOnline;

    
    const aggregation = [
      
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },

      ...(isOnline === "true" || isOnline === "false"
        ? [
            {
              $match: {
                "user.isOnline": isOnline === "true",
              },
            },
          ]
        : []),

   
      ...(search
        ? [
            {
              $match: {
                $or: [
                  {
                    "user.firstname": {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    "user.lastname": {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    "user.email": {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    department: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    skills: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),

   
      {
        $lookup: {
          from: "servicerequests",
          let: {
            staffId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$assignedStaffId", "$$staffId"],
                },
              },
            },

            {
              $group: {
                _id: null,

                assignedRequests: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "assigned"] }, 1, 0],
                  },
                },

                inProgressRequests: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0],
                  },
                },

                completedRequests: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                  },
                },

                totalRequests: {
                  $sum: 1,
                },
              },
            },
          ],
          as: "requestStats",
        },
      },

      {
        $project: {
          _id: 1,
          userId: 1,
          employeeId: 1,
          department: 1,
          skills: 1,
          createdAt: 1,

         
          firstname: "$user.firstname",
          lastname: "$user.lastname",
          email: "$user.email",
          gender: "$user.gender",
          isActive: "$user.isActive",
          isOnline: "$user.isOnline",

          
          assignedRequests: {
            $ifNull: [
              {
                $arrayElemAt: ["$requestStats.assignedRequests", 0],
              },
              0,
            ],
          },

          inProgressRequests: {
            $ifNull: [
              {
                $arrayElemAt: ["$requestStats.inProgressRequests", 0],
              },
              0,
            ],
          },

          completedRequests: {
            $ifNull: [
              {
                $arrayElemAt: ["$requestStats.completedRequests", 0],
              },
              0,
            ],
          },

          totalRequests: {
            $ifNull: [
              {
                $arrayElemAt: ["$requestStats.totalRequests", 0],
              },
              0,
            ],
          },
        },
      },

      {
        $facet: {
          staff: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],

          totalStaff: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const aggResult = await staffServices.getAggData(aggregation);
    const data = aggResult[0] || {};
    const staff = data.staff || [];
    const totalStaff = data.totalStaff?.[0]?.count || 0;
    const totalPages = Math.ceil(totalStaff / limit);
    // console.log(staff);
    return res.render("admin/staff/index", {
      staff,
      pagination: {
        page,
        limit,
        totalItems: totalStaff,
        totalPages,
      },
      query: {
        search,
        isOnline,
      },
      baseUrl: "/admin/staff",
    });
  } catch (error) {
    console.error("Staff error:", error);
    return errorResponse(res, { statusCode: 500, message: "server err" });
  }
};

export const renderAddStaff = async (req, res) => {
  try {
    return res.render("admin/staff/addStaff", {
      errors: {},
      formData: {},
    });
  } catch (error) {
    console.error("renderAddStaff error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server error",
    });
  }
};

export const addStaff = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      gender,
      employeeId,
      department,
      skills = [],
    } = req.body;

    const existingUser = await userServices.getdatabyfindOne({ email });

    if (existingUser) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Email already exists",
      });
    }

    const existingStaff = await staffServices.getdatabyfindOne({ employeeId });

    if (existingStaff) {
      return errorResponse(res, {
        statusCode: 400,
        message: "staff already exists",
      });
    }

    const initialPassword = crypto.randomBytes(32).toString("hex");

    const hashedPassword = await hasheValue(initialPassword);

    const setupToken = crypto.randomBytes(32).toString("hex");

    const hashedSetupToken = crypto
      .createHash("sha256")
      .update(setupToken)
      .digest("hex");

    const user = await userServices.createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: "staff",
      gender,
      isEmailVerified: false,
      isActive: true,
      passwordSetupToken: hashedSetupToken,
      passwordSetupExpires: new Date(Date.now() + 30 * 60 * 1000),
    });

    const staff = await staffServices.createStaff({
      userId: user._id,

      employeeId: employeeId.trim(),

      department: department.trim(),

      skills: Array.isArray(skills) ? skills : [],

      isAvailable: true,

      isOnline: false,
    });

    const setupUrl = `${env.clientUrl}/set-password?token=${setupToken}`;

    try {
      await sendStaffInvitationMail({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        employeeId: staff.employeeId,
        department: staff.department,
        setupUrl,
      });
    } catch (error) {
      await staffServices.deleteOne({ _id: staff._id });
      await userServices.deleteOne({ _id: user._id });
      throw new Error(
        "Staff account could not be created because email could not be sent",
      );
    }

    // setFlash(req, "success", "Staff added successfully");

    return successResponse(res, {
      statusCode: 200,
      message: "Staff added successfully",
    });
  } catch (error) {
    console.log("createStaff error:", error);

    setFlash(req, "error", error.message || "Something went wrong");

    return res.redirect("/admin/staff");
  }
};


export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const aggregation = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $lookup: {
          from: "servicerequests",

          let: {
            staffId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$assignedStaffId", "$$staffId"],
                },
              },
            },

            {
              $sort: {
                createdAt: -1,
              },
            },

            {
              $limit: 5,
            },

            {
              $lookup: {
                from: "categories",

                localField: "categoryId",
                foreignField: "_id",

                as: "category",
              },
            },

            {
              $unwind: {
                path: "$category",
              },
            },

            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "requestUser",
              },
            },

            {
              $unwind: {
                path: "$requestUser",
              },
            },

            {
              $project: {
                _id: 1,

                title: 1,

                description: 1,

                priority: 1,

                status: 1,

                createdAt: 1,

                assignedAt: 1,

                startedAt: 1,

                completedAt: 1,

                category: {
                  _id: "$category._id",
                  name: "$category.name",
                },

                user: {
                  _id: "$requestUser._id",
                  firstname: "$requestUser.firstname",
                  lastname: "$requestUser.lastname",
                  email: "$requestUser.email",
                },
              },
            },
          ],

          as: "recentRequests",
        },
      },

      {
        $project: {
          _id: 1,

          employeeId: 1,

          department: 1,

          skills: 1,

          isOnline: 1,

          createdAt: 1,

          user: {
            _id: "$user._id",
            firstname: "$user.firstname",
            lastname: "$user.lastname",
            email: "$user.email",
            gender: "$user.gender",
            isActive: "$user.isActive",
          },

          recentRequests: 1,
        },
      },
    ];

    const result = await staffServices.getAggData(aggregation);

    return res.status(200).json({
      success: true,
      message: "Staff details fetched successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("getStaffById error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load staff details",
    });
  }
};

export const renderEditStaff = async (req, res) => {
  try {
    const id = req.params.id;

    const aggpipiline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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
          userId: 1,
          employeeId: 1,
          department: 1,
          skills: 1,
          isOnline: 1,
          firstname: "$user.firstname",
          lastname: "$user.lastname",
          email: "$user.email",
          gender: "$user.gender",
          isActive: "$user.isActive",
        },
      },
    ];

    const aggResult = await staffServices.getAggData(aggpipiline);
    //  console.log("aggResult:",aggResult[0]);
    return res.render("admin/staff/editStaff", {
      staff: aggResult[0],
      error: null,
    });
  } catch (error) {
    console.log("err:", error);
    return renderServerError(res, {
      statusCode: 500,
      message: "Server Error",
      view: "admin/staff/editStaff",
    });
  }
};

export const editStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const { firstname, lastname, gender, department, skills, isActive } =
      req.body;

    const existingStaff = await staffServices.getDatabyId(id);

    await userServices.updateOne(
      { _id: existingStaff.userId },
      {
        $set: {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          gender: gender.trim(),
          isActive: isActive,
        },
      },
    );
    await staffServices.updateOne(
      { _id: existingStaff._id },
      {
        $set: {
          department: department.trim(),
          skills: Array.isArray(skills) ? skills : [skills],
        },
      },
    );
    return successResponse(res, {
      statusCode: 200,
      message: "Staff Edited successfully",
    });
  } catch (error) {
    console.log("err:", error);
    return renderServerError(res, {
      statusCode: 500,
      message: "failed to edit staff",
      view: "admin/staff/editStaff",
    });
  }
};

// export const deleteStaff = async(req,res) =>{
//   try {
//     const {id} = req.params;
//     const staff = await staffServices.getDatabyId(id)
//     await userServices.updateOne(
//       { _id: staff.userId },
//       {
//         $set: {
//           isActive: false,
//         },
//       }
//     );
//     return successResponse(res,{statusCode:200,message:"staff deactivated  successfully"})
//   } catch (error) {
//     console.log("err:",error)
//     return errorResponse(res,{statusCode:500,message:"Server Err.failed to Delete."})
//   }
// }

export const EditStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existingStaff = await staffServices.getDatabyId(id);

    const existingUser = await userServices.getDatabyId(existingStaff.userId);

    const newStatus = !existingUser.isActive;

    await userServices.updateOne(
      { _id: existingStaff.userId },
      {
        $set: {
          isActive: newStatus,
        },
      },
    );

    await auditLogServices.create({
      userId: req.user.id,

      action: newStatus ? "STAFF_ACTIVATED" : "STAFF_DEACTIVATED",

      entity: "Staff",

      entityId: existingStaff._id,

      oldValue: {
        isActive: existingUser.isActive,
      },

      newValue: {
        isActive: newStatus,
      },

      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
    await redisServices.delete(redisKeys.dashboard.stats())
    return successResponse(res, {
      statusCode: 200,
      message: newStatus
        ? "Staff activated successfully."
        : "Staff deactivated successfully.",
    });
  } catch (error) {
    console.error("Edit Staff Status Error:", error);

    return errorResponse(res, { statusCode: 500, message: "server err" });
  }
};


export const getAllActiveStaff = async (req, res) => {
 
  try {
    const aggPipeline = [
   
      {
        $match: {
          isDeleted: false,
        },
      },

     
      {
        $lookup: {
          from: "users",
          let: {
            userId: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$userId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                firstname: 1,
                lastname: 1,
              },
            },
          ],
          as: "staffUser",
        },
      },
      {
        $unwind: {
          path: "$staffUser",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          _id: 1,
          userId: 1,
          staffUser: 1,
        },
      },

      {
        $sort: {
          "staffUser.firstname": 1,
        },
      },
    ];

    const staff = await staffServices.getAggData(aggPipeline);
    // console.log("staff:",staff)
    return successResponse(res, {
      statusCode: 200,
      message: "Active staff fetched successfully",
      data: staff,
    });
  } catch (error) {
    console.log("getAllActiveStaff error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server error",
      errors: error.message,
    });
  }
};
