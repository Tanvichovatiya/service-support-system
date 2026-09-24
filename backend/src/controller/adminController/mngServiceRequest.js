import ServiceRequestServices from "../../services/ServiceRequestServices.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import staffServices from "../../services/staffServcies.js";
import { auditLogServices } from "../../services/auditLogServices.js";
import notificationServices from "../../services/notificationServices.js";
import { getIo } from "../../socket/initSocket.js";
import mongoose from "mongoose";
import { commentServices } from "../../services/commentServices.js";
import { attachmentServices } from "../../services/attachmentServices.js";
import ExcelJS from "exceljs";
import { userServices } from "../../services/userServices.js";
import redisServices from "../../services/redis/redisServices.js";
import { redisKeys } from "../../utils/redisKey.js";

export const getAllRequest = async (req, res) => {
  
  try {
    let { page = 1, search = "", status, priority } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const matchStage = {};

    if (status) {
      matchStage.status = status;
    }

    if (priority) {
      matchStage.priority = priority;
    }

    const aggpipeline = [
      {
        $match: matchStage,
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
                email: 1,
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
          localField: "assignedStaffId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                employeeId: 1,
                department: 1,
                skills: 1,
                userId: 1,
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
                      email: 1,
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

                  {
                    "assignedStaff.user.firstname": {
                      $regex: search,
                      $options: "i",
                    },
                  },

                  {
                    "assignedStaff.user.lastname": {
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
        $facet: {
          data: [
            {
              $sort: {
                createdAt: -1,
              },
            },

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

                user: 1,

                category: 1,

                assignedStaff: 1,
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

    const result = await ServiceRequestServices.getAggData(aggpipeline);

    const requests = result[0]?.data || [];

    const totalRequests = result[0]?.totalCount[0]?.count || 0;

    const totalPages = Math.ceil(totalRequests / limit);
   
    return res.render("admin/servicerequest/index", {
      requests,
      pagination: {
        page,
        limit,
        totalItems: totalRequests,
        totalPages,
      },
      query: {
        search,
        status,
        priority,
      },
      baseUrl: "/admin/servicerequest",
    });
  } catch (error) {
    console.log("err:", error);
    return errorResponse(res, { statusCode: 500, message: "server err" });
  }
};

export const getRequestById = async (req, res) => {
  try {
    console.log("call ");
    const { reqid } = req.params;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(reqid),
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
          localField: "assignedStaffId",
          foreignField: "_id",
          pipeline: [
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
                      email: 1,
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
            requestId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$belongsTo", "$$requestId"],
                    },
                    {
                      $eq: ["$belongsToModel", "ServiceRequest"],
                    },
                  ],
                },
              },
            },

            {
              $sort: {
                createdAt: 1,
              },
            },

            {
              $lookup: {
                from: "users",
                localField: "uploadedBy",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      firstname: 1,
                      lastname: 1,
                      role: 1,
                      profilePic: 1,
                    },
                  },
                ],
                as: "uploader",
              },
            },

            {
              $unwind: {
                path: "$uploader",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "attachments",
        },
      },

      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "requestId",
          pipeline: [
            {
              $sort: {
                createdAt: 1,
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
                      email: 1,
                      role: 1,
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
                from: "attachments",
                let: {
                  commentId: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$belongsTo", "$$commentId"],
                          },
                          {
                            $eq: ["$belongsToModel", "Comment"],
                          },
                        ],
                      },
                    },
                  },

                  {
                    $sort: {
                      createdAt: 1,
                    },
                  },

                  {
                    $project: {
                      _id: 1,
                      url: 1,
                      publicId: 1,
                      uploadedBy: 1,
                      createdAt: 1,
                    },
                  },
                ],
                as: "attachments",
              },
            },
          ],
          as: "comments",
        },
      },

      {
        $lookup: {
          from: "auditlogs",
          localField: "_id",
          foreignField: "entityId",
          pipeline: [
            {
              $match: {
                entity: "ServiceRequest",
              },
            },

            {
              $sort: {
                createdAt: -1,
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
                      role: 1,
                    },
                  },
                ],
                as: "actor",
              },
            },

            {
              $unwind: {
                path: "$actor",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "history",
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
          updatedAt: 1,

          assignedAt: 1,
          startedAt: 1,
          completedAt: 1,

          user: 1,
          category: 1,
          assignedStaff: 1,

          attachments: 1,

          comments: 1,
          history: 1,
        },
      },
    ];

    const result = await ServiceRequestServices.getAggData(pipeline);

    return res.render("admin/serviceRequest/viewServiceReq", {
      serviceRequest: result[0],
      title: result[0].title || "Service Request",
    });
  } catch (error) {
    console.log("getRequestById error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch service request",
      errors: error.message,
    });
  }
};

export const assignRequest = async (req, res) => {
  try {
    const { reqid } = req.params;
    const { staffId } = req.body;
    const adminId = req.user.id;

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
    });

    if (serviceRequest.status !== "pending") {
      return errorResponse(res, {
        statusCode: 400,
        message: `Request cannot be assigned when status is "${serviceRequest.status}".`,
      });
    }

    const staff = await staffServices.getdatabyfindOne({
      _id: staffId,
      isDeleted: false,
    });

    if (!staff) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Active staff not found",
      });
    }
    const assignedAt = new Date();

    await ServiceRequestServices.updateOne(
      {
        _id: reqid,
        status: "pending",
      },
      {
        $set: {
          assignedStaffId: staff._id,
          status: "assigned",
          assignedAt,
        },
      },
    );

    await auditLogServices.create({
      userId: adminId,
      action: "SERVICE_REQUEST_ASSIGNED",
      entity: "ServiceRequest",
      entityId: serviceRequest._id,
      oldValue: {
        assignedStaffId: null,
        status: serviceRequest.status,
        assignedAt: serviceRequest.assignedAt || null,
      },
      newValue: {
        assignedStaffId: staff._id,
        status: "assigned",
        assignedAt,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const staffNotification = await notificationServices.createNotification({
      receiverId: staff.userId,
      senderId: adminId,
      requestId: serviceRequest._id,
      type: "request_assigned",
      message: `A new service request "${serviceRequest.title}" has been assigned to you.`,
    });

    const userNotification = await notificationServices.createNotification({
      receiverId: serviceRequest.userId,
      senderId: adminId,
      requestId: serviceRequest._id,
      type: "request_assigned",
      message: `Your service request "${serviceRequest.title}" has been assigned to a staff member.`,
    });

    const io = getIo();

    io.to(`staff:${staff.userId}`).emit("service-request:assigned", {
      requestId: serviceRequest._id,
      staffId: staff._id,
      status: "assigned",
      notification: staffNotification.notification,
      unreadCount: staffNotification.unreadCount,
    });
    io.to(`user:${serviceRequest.userId}`).emit("service-request:assigned", {
      requestId: serviceRequest._id,
      staffId: staff._id,
      status: "assigned",
      notification: userNotification.notification,
      unreadCount: userNotification.unreadCount,
    });
     await redisServices.delete(redisKeys.dashboard.stats())

    return successResponse(res, {
      statusCode: 200,
      message: "Service request assigned successfully",
    });
  } catch (error) {
    console.log("assignRequest error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to assign service request",
      errors: error.message,
    });
  }
};

export const reassignRequest = async (req, res) => {
  try {
    const { reqid } = req.params;
    const { staffId } = req.body;
    const adminId = req.user.id;
    console.log("staff id:", staffId);

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
    });

    if (["completed", "cancelled"].includes(serviceRequest.status)) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Completed or cancelled request cannot be reassigned.",
      });
    }

    const newStaff = await staffServices.getdatabyfindOne({
      _id: staffId,
      isDeleted: false,
    });

    

    if (
      serviceRequest.assignedStaffId &&
      serviceRequest.assignedStaffId.toString() === newStaff._id.toString()
    ) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Request is already assigned to this staff member.",
      });
    }

    const oldStaffId = serviceRequest.assignedStaffId;

    const assignedAt = new Date();

    const updatedRequest = await ServiceRequestServices.updateOne(
      {
        _id: reqid,
      },
      {
        $set: {
          assignedStaffId: newStaff._id,
          status:
            serviceRequest.status === "pending"
              ? "assigned"
              : serviceRequest.status,
          assignedAt,
        },
      },
    );

    await auditLogServices.create({
      userId: adminId,
      action: "SERVICE_REQUEST_REASSIGNED",
      entity: "ServiceRequest",
      entityId: serviceRequest._id,
      oldValue: {
        assignedStaffId: oldStaffId,
        status: serviceRequest.status,
        assignedAt: serviceRequest.assignedAt || null,
      },
      newValue: {
        assignedStaffId: newStaff._id,
        status:
          serviceRequest.status === "pending"
            ? "assigned"
            : serviceRequest.status,
        assignedAt,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const io = getIo();

    // 7. Notify old staff
    if (oldStaffId) {
      const oldStaff = await staffServices.getdatabyfindOne({
        _id: oldStaffId,
      });

      if (oldStaff) {
        const oldStaffNotification =
          await notificationServices.createNotification({
            receiverId: oldStaff.userId,
            senderId: adminId,
            requestId: serviceRequest._id,
            type: "request_reassigned",
            message: `Service request "${serviceRequest.title}" has been reassigned to another staff member.`,
          });

        io.to(`staff:${oldStaff.userId}`).emit("service-request:removed", {
          requestId: serviceRequest._id,
          staffId: oldStaff._id,
          notification: oldStaffNotification.notification,
          unreadCount: oldStaffNotification.unreadCount,
        });
      }
    }

    const newStaffNotification = await notificationServices.createNotification({
      receiverId: newStaff.userId,
      senderId: adminId,
      requestId: serviceRequest._id,
      type: "request_reassigned",
      message: `Service request "${serviceRequest.title}" has been assigned to you.`,
    });

    io.to(`staff:${newStaff.userId}`).emit("service-request:reassigned", {
      requestId: serviceRequest._id,
      staffId: newStaff._id,
      status:
        serviceRequest.status === "pending"
          ? "assigned"
          : serviceRequest.status,
      notification: newStaffNotification.notification,
      unreadCount: newStaffNotification.unreadCount,
    });

    const userNotification = await notificationServices.createNotification({
      receiverId: serviceRequest.userId,
      senderId: adminId,
      requestId: serviceRequest._id,
      type: "request_reassigned",
      message: `Your service request "${serviceRequest.title}" has been reassigned to another staff member.`,
    });

    io.to(`user:${serviceRequest.userId}`).emit("service-request:reassigned", {
      requestId: serviceRequest._id,
      staffId: newStaff._id,
      status:
        serviceRequest.status === "pending"
          ? "assigned"
          : serviceRequest.status,
      notification: userNotification.notification,
      unreadCount: userNotification.unreadCount,
    });

    // io.to("admins").emit("service-request:updated", {
    //   requestId: serviceRequest._id,
    //   assignedStaffId: newStaff._id,
    //   status:
    //     serviceRequest.status === "pending"
    //       ? "assigned"
    //       : serviceRequest.status,
    // });
     await redisServices.delete(redisKeys.dashboard.stats())
    return successResponse(res, {
      statusCode: 200,
      message: "Service request reassigned successfully",
      data: {
        requestId: serviceRequest._id,
        oldStaffId,
        newStaffId: newStaff._id,
      },
    });
  } catch (error) {
    console.log("reassignRequest error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to reassign service request",
      errors: error.message,
    });
  }
};

export const getRequestComments = async (req, res) => {
  try {
    const { reqid } = req.params;

    const comments = await commentServices.getAggData([
      {
        $match: {
          requestId: new mongoose.Types.ObjectId(reqid),
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
                role: 1,
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
          from: "attachments",
          let: {
            commentId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$belongsTo", "$$commentId"],
                    },
                    {
                      $eq: ["$belongsToModel", "Comment"],
                    },
                  ],
                },
              },
            },

            {
              $sort: {
                createdAt: 1,
              },
            },

            {
              $project: {
                _id: 1,
                url: 1,
                publicId: 1,
                uploadedBy: 1,
                createdAt: 1,
              },
            },
          ],
          as: "attachments",
        },
      },

      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

    return successResponse(res, {
      statusCode: 200,
      message: "Comments fetched successfully",
      data: {
        comments,
      },
    });
  } catch (error) {
    console.log("getRequestComments error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch comments",
      errors: error.message,
    });
  }
};
export const updateRequestStatus = async (req, res) => {
  try {
    const { reqid } = req.params;
    const { status } = req.body;

    const userId = req.user.id;
    const role = req.user.role;

    const serviceRequest =
      await ServiceRequestServices.getdatabyfindOne({
        _id: reqid,
      });

   

    const currentStatus = serviceRequest.status;

    const allowedTransitions = {
      staff: {
        in_progress: ["completed"],
      },

      admin: {
        pending: ["assigned"],
        assigned: ["in_progress"],
        in_progress: ["completed"],
      },
    };

    const allowedStatuses =
      allowedTransitions[role]?.[currentStatus] || [];

    if (!allowedStatuses.includes(status)) {
      return errorResponse(res, {
        statusCode: 400,
        message: `Cannot change status from "${currentStatus}" to "${status}".`,
      });
    }

    const updateData = {
      status,
    };

    if (status === "assigned") {
      updateData.assignedAt = new Date();
    }

    if (status === "in_progress") {
      updateData.startedAt = new Date();
    }

    if (status === "completed") {
      updateData.completedAt = new Date();
    }

    await ServiceRequestServices.updateOne(
      {
        _id: reqid,
        status: currentStatus,
      },
      {
        $set: updateData,
      }
    );

    await auditLogServices.create({
      userId,
      action: "SERVICE_REQUEST_STATUS_CHANGED",
      entity: "ServiceRequest",
      entityId: serviceRequest._id,

      oldValue: {
        status: currentStatus,
      },

      newValue: {
        status,
      },

      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const io = getIo();

    const admin = await userServices.getdatabyfindOne({
      role: "admin",
      isActive: true,
    });

    if (role !== "user") {
      const userNotification =
        await notificationServices.createNotification({
          receiverId: serviceRequest.userId,
          senderId: userId,
          requestId: serviceRequest._id,
          type: "status_changed",
          message: `Your service request "${serviceRequest.title}" status changed to "${status}".`,
        });

      io.to(`user:${serviceRequest.userId}`).emit(
        "service-request:status-updated",
        {
          requestId: serviceRequest._id,
          status,
          notification: userNotification.notification,
          unreadCount: userNotification.unreadCount,
        }
      );
    }

    if (role !== "staff" && serviceRequest.assignedStaffId) {
      const staff = await staffServices.getdatabyfindOne({
        _id: serviceRequest.assignedStaffId,
      });

      if (staff) {
        const staffNotification =
          await notificationServices.createNotification({
            receiverId: staff.userId,
            senderId: userId,
            requestId: serviceRequest._id,
            type: "status_changed",
            message: `Service request "${serviceRequest.title}" status changed to "${status}".`,
          });

        io.to(`staff:${staff.userId}`).emit(
          "service-request:status-updated",
          {
            requestId: serviceRequest._id,
            status,
            notification: staffNotification.notification,
            unreadCount: staffNotification.unreadCount,
          }
        );
      }
    }

    if (role !== "admin" && admin) {
      const adminNotification =
        await notificationServices.createNotification({
          receiverId: admin._id,
          senderId: userId,
          requestId: serviceRequest._id,
          type: "status_changed",
          message: `Service request "${serviceRequest.title}" status changed to "${status}".`,
        });

      io.to("admins").emit(
        "service-request:status-updated",
        {
          requestId: serviceRequest._id,
          status,
          notification: adminNotification.notification,
          unreadCount: adminNotification.unreadCount,
        }
      );
    }

    await redisServices.delete(redisKeys.dashboard.stats());

    return successResponse(res, {
      statusCode: 200,
      message: "Request status updated successfully",
    });
  } catch (error) {
    console.log("updateRequestStatus error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to update request status",
      errors: error.message,
    });
  }
};

export const exportServiceReqReport = async (req, res) => {
  try {
    const pipeline = [
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
          preserveNullAndEmptyArrays: true,
        },
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
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "staffs",
          localField: "assignedStaffId",
          foreignField: "_id",
          as: "staff",
        },
      },
      {
        $unwind: {
          path: "$staff",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "staff.userId",
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

          userName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$user.firstname", ""] },
                  " ",
                  { $ifNull: ["$user.lastname", ""] },
                ],
              },
            },
          },

          userEmail: {
            $ifNull: ["$user.email", ""],
          },

          categoryName: {
            $ifNull: ["$category.name", ""],
          },

          title: {
            $ifNull: ["$title", ""],
          },
          description: {
            $ifNull: ["$description", ""],
          },

          priority: {
            $ifNull: ["$priority", ""],
          },

          status: {
            $ifNull: ["$status", ""],
          },

          staffName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$staffUser.firstname", ""] },
                  " ",
                  { $ifNull: ["$staffUser.lastname", ""] },
                ],
              },
            },
          },

          employeeId: {
            $ifNull: ["$staff.employeeId", ""],
          },

          createdAt: 1,
          updatedAt: 1,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const requests = await ServiceRequestServices.getAggData(pipeline);

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Admin Panel";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Service Requests");

    worksheet.columns = [
      {
        header: "Title",
        key: "title",
        width: 25,
      },
      {
        header: "Description",
        key: "description",
        width: 45,
      },
      {
        header: "Category",
        key: "categoryName",
        width: 25,
      },
      {
        header: "User Name",
        key: "userName",
        width: 25,
      },
      {
        header: "User Email",
        key: "userEmail",
        width: 30,
      },
      {
        header: "Priority",
        key: "priority",
        width: 15,
      },
      {
        header: "Status",
        key: "status",
        width: 18,
      },
      {
        header: "Assigned Staff",
        key: "staffName",
        width: 25,
      },
      {
        header: "Employee ID",
        key: "employeeId",
        width: 18,
      },
      {
        header: "Created At",
        key: "createdAt",
        width: 22,
      },
      {
        header: "Updated At",
        key: "updatedAt",
        width: 22,
      },
    ];

    requests.forEach((request) => {
      worksheet.addRow({
        title: request.title || "",
        description: request.description || "",
        categoryName: request.categoryName || "",
        userName: request.userName || "",
        userEmail: request.userEmail || "",
        priority: request.priority || "",
        status: request.status || "",
        staffName: request.staffName || "Not Assigned",
        employeeId: request.employeeId || "",
        createdAt: request.createdAt ? new Date(request.createdAt) : "",
        updatedAt: request.updatedAt ? new Date(request.updatedAt) : "",
      });
    });

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    headerRow.height = 25;

    worksheet.getColumn("createdAt").numFmt = "dd-mm-yyyy hh:mm";

    worksheet.getColumn("updatedAt").numFmt = "dd-mm-yyyy hh:mm";

    worksheet.eachRow((row, rowNumber) => {
      row.alignment = {
        vertical: "top",
        wrapText: true,
      };

      if (rowNumber > 1) {
        row.height = 35;
      }
    });

    worksheet.autoFilter = {
      from: "A1",
      to: "K1",
    };

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    const fileName = `service-request-report-${Date.now()}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.log("exportServiceReqReport error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export service request report",
      errors: error.message,
    });
  }
};

export const getRequestByIdData = async (req, res) => {
  try {
    const { reqid } = req.params;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(reqid),
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
          from: "staffs",
          localField: "assignedStaffId",
          foreignField: "_id",
          pipeline: [
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
                      email: 1,
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
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          assignedStaff: 1,
        },
      },
    ];

    const result = await ServiceRequestServices.getAggData(pipeline);

 

    return successResponse(res, {
      statusCode: 200,
      message: "Service request fetched successfully",
      data: result[0],
    });
  } catch (error) {
    console.log("getRequestByIdData error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch service request",
      errors: error.message,
    });
  }
};

export const renderNotificationPage = async (req, res) => {
  try {
    return res.render("admin/notification/index", {
      title: "Notifications",
    });
  } catch (error) {
    console.log("renderNotificationPage error:", error);

    return res.status(500).render("admin/error", {
      message: "Failed to load notifications",
    });
  }
};

export const deleteServiceRequest = async (req, res) => {
  try {
    const { reqid } = req.params;

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
    });

    const categoryId = serviceRequest.categoryId;

    await ServiceRequestServices.deleteOne({
      _id: reqid,
    });

    await redisServices.delete(redisKeys.category.all());

    await redisServices.delete(redisKeys.category.byId(categoryId));

    await redisServices.delete(redisKeys.dashboard.stats())

    return successResponse(res, {
      statusCode: 200,
      message: "Service request deleted successfully.",
    });
  } catch (error) {
    
    console.log(" error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Unable to delete service request.",
      errors: error.message,
    });
  }
};
