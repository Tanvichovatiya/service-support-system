import mongoose from "mongoose";
import { auditLogServices } from "../services/auditLogServices.js";
import { categoryServices } from "../services/categoryServices.js";
import ServiceRequestServices from "../services/ServiceRequestServices.js";
import { userServices } from "../services/userServices.js";
import { getIo } from "../socket/initSocket.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

import NotificationServices from "../services/notificationServices.js";
import staffServices from "../services/staffServcies.js";
import notificationServices from "../services/notificationServices.js";

import { attachmentServices } from "../services/attachmentServices.js";
import { saveUploadedFiles } from "../utils/fileUploadHelper.js";
import { redisKeys } from "../utils/redisKey.js";
import redisServices from "../services/redis/redisServices.js";

export const createRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const { categoryId, title, description, priority = "medium" } = req.body;

    // const category = await categoryServices.getdatabyfindOne({
    //   _id: categoryId,
    //   isActive: true,
    // });

    const files = Array.isArray(req.files) ? req.files : [];

    const serviceRequest = await ServiceRequestServices.createService({
      userId,
      categoryId,
      title,
      description,
      priority,
      attachments: [],
    });

    await redisServices.delete(redisKeys.category.all());
    await redisServices.delete(redisKeys.category.byId(categoryId));

    let attachmentIds = [];

    if (files.length > 0) {
      try {
        attachmentIds = await saveUploadedFiles({
          files,
          folder: "service-requests",
        });

        await ServiceRequestServices.updateOne(
          {
            _id: serviceRequest._id,
          },
          {
            $set: {
              attachments: attachmentIds,
            },
          },
        );
      } catch (error) {
        console.log("Request attachment error:", error);

        return errorResponse(res, {
          statusCode: 500,
          message: "Failed to save request attachments.",
          errors: error.message,
        });
      }
    }

    await auditLogServices.create({
      userId,

      action: "SERVICE_REQUEST_CREATED",

      entity: "ServiceRequest",

      entityId: serviceRequest._id,

      oldValue: null,

      newValue: {
        userId,
        categoryId,
        title,
        description,
        priority,
        attachments: attachmentIds,
      },

      ipAddress: req.ip,

      userAgent: req.get("user-agent"),
    });

    const admin = await userServices.getdatabyfindOne({
      role: "admin",
      isActive: true,
    });

    if (admin && req.user.role != "admin") {
      const notification = await notificationServices.createNotification({
        receiverId: admin._id,
        senderId: userId,
        requestId: serviceRequest._id,
        type: "new_request",
        message: `New service request "${serviceRequest.title}" has been created.`,
      });

      const io = getIo();

      io.to("admins").emit("service-request:new", {
        notification: notification.notification,
        unreadCount: notification.unreadCount,
      });
    }

    await redisServices.delete(redisKeys.dashboard.stats());

    return successResponse(res, {
      statusCode: 201,
      message: "Service request created successfully.",
    });

  } catch (error) {
    console.log(" error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to create service request.",
      errors: error.message,
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const search = req.query.search || "";
    const status = req.query.status || "";

    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const matchStage = {
      userId: userObjectId,
    };

    if (status) {
      matchStage.status = status;
    }

    const aggpipline = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "categories",
          let: { categoryId: "$categoryId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$categoryId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                isActive: 1,
              },
            },
          ],
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      ...(search.trim()
        ? [
            {
              $match: {
                $or: [
                  {
                    title: {
                      $regex: search.trim(),
                      $options: "i",
                    },
                  },
                  {
                    description: {
                      $regex: search.trim(),
                      $options: "i",
                    },
                  },
                  {
                    "category.name": {
                      $regex: search.trim(),
                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),

      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          requests: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },

            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                priority: 1,
                status: 1,
                attachments: 1,
                createdAt: 1,
                updatedAt: 1,

                category: {
                  _id: "$category._id",
                  name: "$category.name",
                },
              },
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
    const result = await ServiceRequestServices.getAggData(aggpipline);
    const requests = result[0].requests || [];
    const totalreq = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalreq / limit);

    return successResponse(res, {
      statusCode: 200,
      message: "Service requests fetched successfully",
      data: {
        requests,
        totalreq,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.log("err:", error);
    return errorResponse(res, {
      statusCode: 500,
      message: "server err",
      errors: error.message,
    });
  }
};

export const getMyRequestById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reqid } = req.params;

    console.log("reqid:", reqid);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const requestObjectId = new mongoose.Types.ObjectId(reqid);

    const pipeline = [
      {
        $match: {
          _id: requestObjectId,
          userId: userObjectId,
        },
      },
      {
        $lookup: {
          from: "categories",

          let: {
            categoryId: "$categoryId",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$categoryId"],
                },
              },
            },

            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                isActive: 1,
              },
            },
          ],

          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "staffs",

          let: {
            assignedStaffId: "$assignedStaffId",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$assignedStaffId"],
                },
              },
            },

            {
              $lookup: {
                from: "users",

                let: {
                  staffUserId: "$userId",
                },

                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$staffUserId"],
                      },
                    },
                  },

                  {
                    $project: {
                      _id: 1,
                      firstname: 1,
                      lastname: 1,
                      profilePic: 1,
                    },
                  },
                ],

                as: "user",
              },
            },

            {
              $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                employeeId: 1,
                department: 1,
                skills: 1,
                user: 1,
              },
            },
          ],

          as: "assignedStaff",
        },
      },

      {
        $unwind: {
          path: "$assignedStaff",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "attachments",

          let: {
            attachmentIds: "$attachments",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $ifNull: ["$$attachmentIds", []],
                    },
                  ],
                },
              },
            },

            {
              $project: {
                _id: 1,
                originalName: 1,
                fileName: 1,
                filePath: 1,
                mimeType: 1,
                size: 1,
                createdAt: 1,
              },
            },
          ],

          as: "attachments",
        },
      },

      // {
      //   $lookup: {
      //     from: "auditlogs",

      //     let: {
      //       requestId: "$_id",
      //     },

      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $eq: ["$entityId", "$$requestId"],
      //           },

      //           entity: "ServiceRequest",
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "users",

      //           let: {
      //             actorId: "$userId",
      //           },

      //           pipeline: [
      //             {
      //               $match: {
      //                 $expr: {
      //                   $eq: ["$_id", "$$actorId"],
      //                 },
      //               },
      //             },

      //             {
      //               $project: {
      //                 _id: 1,
      //                 firstname: 1,
      //                 lastname: 1,
      //                 role: 1,
      //                 profilePic: 1,
      //               },
      //             },
      //           ],

      //           as: "actor",
      //         },
      //       },

      //       {
      //         $unwind: {
      //           path: "$actor",
      //           preserveNullAndEmptyArrays: true,
      //         },
      //       },

      //       {
      //         $project: {
      //           _id: 1,
      //           action: 1,
      //           entity: 1,
      //           entityId: 1,
      //           oldValue: 1,
      //           newValue: 1,
      //           ipAddress: 1,
      //           userAgent: 1,
      //           createdAt: 1,
      //           actor: 1,
      //         },
      //       },

      //       {
      //         $sort: {
      //           createdAt: 1,
      //         },
      //       },
      //     ],

      //     as: "history",
      //   },
      // },

      {
        $project: {
          _id: 1,

          userId: 1,

          title: 1,
          description: 1,

          categoryId: 1,
          category: 1,

          priority: 1,
          status: 1,

          attachments: 1,

          assignedStaffId: 1,
          assignedStaff: 1,

          assignedAt: 1,
          startedAt: 1,
          completedAt: 1,

          createdAt: 1,
          updatedAt: 1,

          // history: 1,
        },
      },
    ];

    const result = await ServiceRequestServices.getAggData(pipeline);

    return successResponse(res, {
      statusCode: 200,
      message: "Service request fetched successfully",
      data: {
        serviceRequest: result[0],
      },
    });
  } catch (error) {
    console.log("getMyRequestById error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch service request",
      errors: error.message,
    });
  }
};

export const getAllReqofStaff = async (req, res) => {
  try {
    const { id: userId } = req.user;
    // console.log("userId:", userId);

    const { status, priority, search = "", page: pageQuery } = req.query;

    const staff = await staffServices.getdatabyfindOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const page = Math.max(Number(pageQuery) || 1, 1);

    const limit = 6;
    const skip = (page - 1) * limit;

    const match = {
      assignedStaffId: new mongoose.Types.ObjectId(staff._id),
      status: {
        $in: ["assigned", "in_progress", "completed"],
      },
    };

    if (status) {
      match.status = status;
    }

    if (priority) {
      match.priority = priority;
    }

    const pipeline = [
      {
        $match: match,
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
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: "$category",
      },

      ...(search
        ? [
            {
              $match: {
                $or: [
                  {
                    title: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    description: {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    "category.name": {
                      $regex: search,
                      $options: "i",
                    },
                  },
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
                ],
              },
            },
          ]
        : []),

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result = await ServiceRequestServices.getAggData(pipeline);

  
    const requests = result[0]?.data || [];

    const totalRequest = result[0]?.total[0]?.count || 0;

    return successResponse(res, {
      statusCode: 200,
      message: "Assigned requests fetched successfully.",

      data: {
        requests,
        page,
        limit,
        totalPages: Math.ceil(totalRequest / limit),
        totalRequest,
      },
    });
  } catch (error) {
    console.log("error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch assigned requests.",
      errors: error.message,
    });
  }
};

export const getAssignedRequestById = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { reqid } = req.params;

    const staff = await staffServices.getdatabyfindOne({
      userId,
    });

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(reqid),
          assignedStaffId: new mongoose.Types.ObjectId(staff._id),
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                firstname: 1,
                lastname: 1,
                profilePic: 1,
              },
            },
          ],
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
              },
            },
          ],
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "attachments",
          localField: "attachments",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                originalName: 1,
                fileName: 1,
                filePath: 1,
                mimeType: 1,
                size: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          as: "attachments",
        },
      },

      // {
      //   $lookup: {
      //     from: "comments",
      //     let: {
      //       requestId: "$_id",
      //     },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $eq: ["$requestId", "$$requestId"],
      //           },
      //         },
      //       },

      //       {
      //         $sort: {
      //           createdAt: 1,
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "users",
      //           localField: "userId",
      //           foreignField: "_id",
      //           pipeline: [
      //             {
      //               $project: {
      //                 _id: 1,
      //                 firstname: 1,
      //                 lastname: 1,
      //                 role: 1,
      //                 profilePic: 1,
      //               },
      //             },
      //           ],
      //           as: "commentUser",
      //         },
      //       },

      //       {
      //         $unwind: {
      //           path: "$commentUser",
      //           preserveNullAndEmptyArrays: true,
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "attachments",
      //           localField: "attachments",
      //           foreignField: "_id",
      //           pipeline: [
      //             {
      //               $project: {
      //                 _id: 1,
      //                 originalName: 1,
      //                 fileName: 1,
      //                 filePath: 1,
      //                 mimeType: 1,
      //                 size: 1,
      //                 createdAt: 1,
      //                 updatedAt: 1,
      //               },
      //             },
      //           ],
      //           as: "attachments",
      //         },
      //       },

      //       {
      //         $project: {
      //           _id: 1,
      //           message: 1,
      //           createdAt: 1,
      //           updatedAt: 1,
      //           commentUser: 1,
      //           attachments: 1,
      //         },
      //       },
      //     ],
      //     as: "comments",
      //   },
      // },

      {
        $project: {
          _id: 1,

          title: 1,
          description: 1,

          priority: 1,
          status: 1,

          createdAt: 1,
          updatedAt: 1,

          assignedAt: 1,
          startedAt: 1,
          completedAt: 1,

          user: 1,
          category: 1,

          attachments: 1,
          comments: 1,
        },
      },
    ];

    const result = await ServiceRequestServices.getAggData(pipeline);

  
    return successResponse(res, {
      statusCode: 200,
      message: "Service request fetched successfully.",
      data: result[0],
    });
    
  } catch (error) {
    console.log("getAssignedRequestById error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch service request.",
      errors: error.message,
    });
  }
};

export const acceptAssignedRequest = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { reqid } = req.params;

    const staff = await staffServices.getdatabyfindOne({
      userId,
    });

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
      assignedStaffId: staff._id,
    });

    const admin = await userServices.getdatabyfindOne({ role: "admin" });

    const oldStatus = serviceRequest.status;

    await ServiceRequestServices.updateOne(
      {
        _id: reqid,
        assignedStaffId: staff._id,
        status: "assigned",
      },
      {
        $set: {
          status: "in_progress",
          startedAt: new Date(),
        },
      },
    );

    

    await auditLogServices.create({
      userId,
      action: "ACCEPT_SERVICE_REQUEST",
      entity: "ServiceRequest",
      entityId: serviceRequest._id,
      oldValue: {
        status: oldStatus,
      },
      newValue: {
        status: "in_progress",
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const usernotification = await notificationServices.createNotification({
      receiverId: serviceRequest.userId,
      senderId: userId,
      requestId: serviceRequest._id,
      type: "status_changed",
      message: `Your service request "${serviceRequest.title}" status has been changed to "In Progress".`,
    });

    const io = getIo();

    io.to(`user:${serviceRequest.userId}`).emit(
      "service-request:status-updated",
      {
        requestId: serviceRequest._id,
        status: "in_progress",
        usernotification,
      },
    );

    const adminNotification = await notificationServices.createNotification({
      receiverId: admin._id,
      senderId: userId,
      requestId: serviceRequest._id,
      type: "status_changed",
      message: `Staff accepted service request "${serviceRequest.title}".`,
    });

    io.to("admins").emit("service-request:status-updated", {
      requestId: serviceRequest._id,
      status: "in_progress",
      notification: adminNotification,
    });
    await redisServices.delete(redisKeys.dashboard.stats());
    return successResponse(res, {
      statusCode: 200,
      message: "Service request accepted successfully.",
      data: {
        requestId: serviceRequest._id,
        status: "in_progress",
      },
    });
  } catch (error) {
    console.log("acceptAssignedRequest error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to accept service request.",
      errors: error.message,
    });
  }
};

export const getRequestHistory = async (req, res) => {
  try {
    const { reqid } = req.params;

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
    });

    const history = await auditLogServices.getAggData([
      {
        $match: {
          entity: "ServiceRequest",
          entityId: new mongoose.Types.ObjectId(reqid),
        },
      },

      {
        $sort: {
          createdAt: 1,
        },
      },

      {
        $set: {
          staffIds: {
            $setUnion: [
              {
                $cond: [
                  {
                    $ne: ["$oldValue.assignedStaffId", null],
                  },
                  ["$oldValue.assignedStaffId"],
                  [],
                ],
              },
              {
                $cond: [
                  {
                    $ne: ["$newValue.assignedStaffId", null],
                  },
                  ["$newValue.assignedStaffId"],
                  [],
                ],
              },
            ],
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "actionUser",
        },
      },

      {
        $unwind: {
          path: "$actionUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "staffs",
          let: {
            staffIds: "$staffIds",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$staffIds"],
                },
              },
            },

            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "staffUser",
              },
            },

            {
              $unwind: {
                path: "$staffUser",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                userId: "$staffUser._id",
                firstname: "$staffUser.firstname",
                lastname: "$staffUser.lastname",
                email: "$staffUser.email",
                role: "$staffUser.role",
              },
            },
          ],
          as: "staffDetails",
        },
      },

      {
        $set: {
          "oldValue.assignedStaff": {
            $let: {
              vars: {
                oldStaff: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$staffDetails",
                        as: "staff",
                        cond: {
                          $eq: ["$$staff._id", "$oldValue.assignedStaffId"],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
              in: "$$oldStaff",
            },
          },

          "newValue.assignedStaff": {
            $let: {
              vars: {
                newStaff: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$staffDetails",
                        as: "staff",
                        cond: {
                          $eq: ["$$staff._id", "$newValue.assignedStaffId"],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
              in: "$$newStaff",
            },
          },
        },
      },

      {
        $project: {
          _id: 1,
          action: 1,
          entity: 1,
          entityId: 1,
          oldValue: 1,
          newValue: 1,
          createdAt: 1,

          userId: {
            _id: "$actionUser._id",
            firstname: "$actionUser.firstname",
            lastname: "$actionUser.lastname",
            role: "$actionUser.role",
          },
        },
      },
    ]);

    return successResponse(res, {
      statusCode: 200,
      message: "Request history fetched successfully.",
      data: {
        request: {
          _id: serviceRequest._id,
          title: serviceRequest.title,
          status: serviceRequest.status,
          createdAt: serviceRequest.createdAt,
          completedAt: serviceRequest.completedAt || null,
        },

        history,
      },
    });
  } catch (error) {
    console.log(" error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch request history.",
      errors: error.message,
    });
  }
};
