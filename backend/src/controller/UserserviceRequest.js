import { auditLogServices } from "../services/auditLogServices.js";

import ServiceRequestServices from "../services/ServiceRequestServices.js";
import { userServices } from "../services/userServices.js";

import { errorResponse, successResponse } from "../utils/apiResponse.js";

import staffServices from "../services/staffServcies.js";

import { saveUploadedFiles } from "../utils/fileUploadHelper.js";
import { redisKeys } from "../utils/redisKey.js";
import redisServices from "../services/redis/redisServices.js";
import { sendNotification } from "../utils/sendNotification.js";
import { buildRegexSearch, getPagination } from "../utils/queryHelper.js";
import { toObjectId } from "../utils/convertToObjectId.js";

export const createRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const { categoryId, title, description, priority = "medium" } = req.body;

    const files = Array.isArray(req.files) ? req.files : [];

    const serviceRequest = await ServiceRequestServices.createService({
      userId,
      categoryId,
      title,
      description,
      priority,
    });

    let attachmentIds = [];

    if (files.length > 0) {
      try {
        attachmentIds = await saveUploadedFiles({
          files,
          folder: "service-requests",
          requestId: serviceRequest._id,
        });
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
      isDeleted: false,
    });

    if (admin) {
      await sendNotification({
        receiverId: admin._id,
        senderId: userId,
        requestId: serviceRequest._id,
        type: "new_request",
        message: `New service request "${serviceRequest.title}" has been created.`,
        room: "admins",
        event: "service-request:new",
      });
    }

    await Promise.all([
      redisServices.delete(redisKeys.dashboard.stats()),
      redisServices.delete(redisKeys.category.byId(categoryId)),
    ]);

    return successResponse(res, {
      statusCode: 201,
      message: "Service request created successfully.",
    });
  } catch (error) {
    console.log("Create request error:", error);

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

    const { page, limit, skip } = getPagination(req.query, 6);

    const search = req.query.search || "";
    const status = req.query.status || "";

    const matchStage = {
      userId: toObjectId(userId),
      isDeleted: false,
    };

    if (status) {
      matchStage.status = status;
    }

    const searchStage = buildRegexSearch(search, [
      "title",
      "description",
      "category.name",
    ]);

    const pipeline = [
      {
        $match: matchStage,
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

      ...(searchStage
        ? [
            {
              $match: searchStage,
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

    const result = await ServiceRequestServices.getAggData(pipeline);

    const requests = result[0]?.requests || [];
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
    console.log("getMyRequests error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch service requests.",
      errors: error.message,
    });
  }
};

export const getMyRequestById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reqid } = req.params;

    const pipeline = [
      {
        $match: {
          _id: toObjectId(reqid),
          userId: toObjectId(userId),
          isDeleted: false,
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
            assignedStaffIds: {
              $ifNull: ["$assignedStaffIds", []],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$assignedStaffIds"],
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
                department: 1,
                user: 1,
              },
            },
          ],
          as: "assignedStaff",
        },
      },

      {
        $lookup: {
          from: "staffs",
          let: {
            acceptedStaffIds: {
              $ifNull: ["$acceptedStaffIds", []],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$acceptedStaffIds"],
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
                department: 1,
                user: 1,
              },
            },
          ],
          as: "acceptedStaff",
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
                  $eq: ["$requestId", "$$requestId"],
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

            {
              $sort: {
                createdAt: 1,
              },
            },
          ],
          as: "attachments",
        },
      },

      {
        $project: {
          _id: 1,
          userId: 1,

          title: 1,
          description: 1,

          category: 1,

          priority: 1,
          status: 1,

          assignedStaff: 1,

          acceptedStaff: 1,

          attachments: 1,

          isOverdue: 1,
          overdueAt: 1,

          assignedAt: 1,
          startedAt: 1,
          completedAt: 1,

          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    const result = await ServiceRequestServices.getAggData(pipeline);

    return successResponse(res, {
      statusCode: 200,
      message: "Service request fetched successfully",
      data: {
        serviceRequest: result[0] || null,
      },
    });
  } catch (error) {
    console.log(" error:", error);

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

    const { status, priority, search = "" } = req.query;
    const { page, limit, skip } = getPagination(req.query, 6);

    const staff = await staffServices.getdatabyfindOne({
      userId: toObjectId(userId),
    });

    const match = {
      assignedStaffIds: toObjectId(staff._id),
      isDeleted: false,
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

    const searchStage = buildRegexSearch(search, [
      "title",
      "description",
      "category.name",
      "user.firstname",
      "user.lastname",
    ]);

    const pipeline = [
      {
        $match: match,
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
        $unwind: "$user",
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
              },
            },
          ],
          as: "category",
        },
      },

      {
        $unwind: "$category",
      },

      ...(searchStage
        ? [
            {
              $match: searchStage,
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
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                priority: 1,
                status: 1,


                user: {
                  _id: "$user._id",
                  firstname: "$user.firstname",
                  lastname: "$user.lastname",
                  profilePic: "$user.profilePic",
                },

                category: {
                  _id: "$category._id",
                  name: "$category.name",
                },
              },
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
    console.log(" error:", error);

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
          _id: toObjectId(reqid),
          assignedStaffIds: toObjectId(staff._id),
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
          from: "attachments",
          localField: "_id",
          foreignField: "requestId",
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
      isDeleted: false,
    });

    const oldStatus = serviceRequest.status;
    const isFirstAcceptance = oldStatus === "assigned";

    const updateData = {
      $addToSet: {
        acceptedStaffIds: staff._id,
      },
    };

    if (isFirstAcceptance) {
      updateData.$set = {
        status: "in_progress",
        startedAt: new Date(),
      };
    }

    await ServiceRequestServices.updateOne(
      {
        _id: reqid,
        isDeleted: false,
        assignedStaffIds: staff._id,
        acceptedStaffIds: {
          $ne: staff._id,
        },
        status: {
          $in: ["assigned", "in_progress"],
        },
      },
      updateData,
    );

    const user = await userServices.getdatabyfindOne({
      _id: userId,
      role: "staff",
      isDeleted: false,
    });

    const admin = await userServices.getdatabyfindOne({
      role: "admin",
      isDeleted: false,
    });

    const staffName = `${user.firstname} ${user.lastname}`.trim();

    await auditLogServices.create({
      userId,
      action: "ACCEPT_SERVICE_REQUEST",
      entity: "ServiceRequest",
      entityId: serviceRequest._id,
      oldValue: {
        status: oldStatus,
      },
      newValue: {
        status: isFirstAcceptance ? "in_progress" : oldStatus,
        acceptedBy: staff._id,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    await sendNotification({
      receiverId: serviceRequest.userId,
      senderId: userId,
      requestId: serviceRequest._id,
      type: "status_changed",
      room: `user:${serviceRequest.userId}`,
      event: "service-request:status-updated",
      data: {
        status: "in_progress",
        staffName,
        staffId: staff._id,
      },
    });

    if (admin) {
      await sendNotification({
        receiverId: admin._id,
        senderId: userId,
        requestId: serviceRequest._id,
        type: "status_changed",
        room: "admins",
        event: "service-request:status-updated",
        data: {
          status: "in_progress",
          staffName,
          staffId: staff._id,
        },
      });
    }

    await redisServices.delete(redisKeys.dashboard.stats());

    return successResponse(res, {
      statusCode: 200,
      message: "Service request accepted successfully.",
      data: {
        requestId: serviceRequest._id,
        status: "in_progress",
        staffId: staff._id,
      },
    });
  } catch (error) {
    console.log("Accept service request error:", error);

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
          entityId: toObjectId(reqid),
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
                $ifNull: ["$oldValue.assignedStaffIds", []],
              },
              {
                $ifNull: ["$newValue.assignedStaffIds", []],
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
            $filter: {
              input: "$staffDetails",
              as: "staff",
              cond: {
                $in: [
                  "$$staff._id",
                  {
                    $ifNull: ["$oldValue.assignedStaffIds", []],
                  },
                ],
              },
            },
          },

          "newValue.assignedStaff": {
            $filter: {
              input: "$staffDetails",
              as: "staff",
              cond: {
                $in: [
                  "$$staff._id",
                  {
                    $ifNull: ["$newValue.assignedStaffIds", []],
                  },
                ],
              },
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
          createdAt: 1,

          userId: {
            _id: "$actionUser._id",
            firstname: "$actionUser.firstname",
            lastname: "$actionUser.lastname",
            role: "$actionUser.role",
          },

          oldValue: {
            status: "$oldValue.status",
            assignedStaffIds: {
              $ifNull: ["$oldValue.assignedStaffIds", []],
            },
            assignedStaff: "$oldValue.assignedStaff",
          },

          newValue: {
            userId: "$newValue.userId",
            categoryId: "$newValue.categoryId",
            title: "$newValue.title",
            description: "$newValue.description",
            priority: "$newValue.priority",
            attachments: {
              $ifNull: ["$newValue.attachments", []],
            },
            status: "$newValue.status",
            assignedStaffIds: {
              $ifNull: ["$newValue.assignedStaffIds", []],
            },
            assignedStaff: "$newValue.assignedStaff",
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
    console.log("getRequestHistory error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch request history.",
      errors: error.message,
    });
  }
};
