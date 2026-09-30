import ServiceRequestServices from "../../services/ServiceRequestServices.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import staffServices from "../../services/staffServcies.js";
import { auditLogServices } from "../../services/auditLogServices.js";
import ExcelJS from "exceljs";
import { userServices } from "../../services/userServices.js";
import redisServices from "../../services/redis/redisServices.js";
import { redisKeys } from "../../utils/redisKey.js";
import { sendReassignmentNotifications } from "../../utils/reassignHelper.js";
import { buildRegexSearch, getPagination } from "../../utils/queryHelper.js";
import { toObjectId } from "../../utils/convertToObjectId.js";
import { sendNotification } from "../../utils/sendNotification.js";
import { compareStaffIds } from "../../utils/compareStaffIds.js";

export const getAllRequest = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 8);
    const { search = "", status, priority } = req.query;

    const matchStage = {
      isDeleted: false,
    };

    if (status) {
      matchStage.status = status;
    }

    if (priority) {
      matchStage.priority = priority;
    }

    const searchMatch = buildRegexSearch(search, [
      "title",
      "description",
      "category.name",
      "user.firstname",
      "user.lastname",
      "assignedStaff.user.firstname",
      "assignedStaff.user.lastname",
    ]);

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
          localField: "assignedStaffIds",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                employeeId: 1,
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

            {
              $project: {
                _id: 1,
                employeeId: 1,
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
          localField: "acceptedStaffIds",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                employeeId: 1,
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

            {
              $project: {
                _id: 1,
                employeeId: 1,
                user: 1,
              },
            },
          ],
          as: "acceptedStaff",
        },
      },
      ...(searchMatch ? [{ $match: searchMatch }] : []),

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
                attachments: 1,
                createdAt: 1,
                user: 1,
                category: 1,
                assignedStaff: 1,
                assignedStaffIds: 1,
                acceptedStaff: 1,
                acceptedStaffIds: 1,
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

    return errorResponse(res, {
      statusCode: 500,
      message: "server err",
    });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { reqid } = req.params;

    const pipeline = [
      {
        $match: {
          _id: toObjectId(reqid),
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
                  $and: [
                    { $eq: ["$_id", "$$userId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
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
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,      
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
          localField: "assignedStaffIds",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                userId: 1,
                employeeId: 1,
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
                        $and: [
                          { $eq: ["$_id", "$$userId"] },
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
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
        $lookup: {
          from: "staffs",
          localField: "acceptedStaffIds",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                userId: 1,
                employeeId: 1,
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
                        $and: [
                          { $eq: ["$_id", "$$userId"] },
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
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
          as: "acceptedStaff",
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
              },
            },
          ],
          as: "attachments",
        },
      },

      {
        $lookup: {
          from: "auditlogs",
          let: {
            requestId: "$_id",
          },
          pipeline: [
            {
              $match: {
                entity: "ServiceRequest",
                $expr: {
                  $eq: ["$entityId", "$$requestId"],
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
                let: {
                  userId: "$userId",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$_id", "$$userId"] },
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
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
                as: "actor",
              },
            },

            {
              $unwind: {
                path: "$actor",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                action: 1,
                details: 1,
                createdAt: 1,
                actor: 1,
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
          user: 1,
          category: 1,
          assignedStaff: 1,
          acceptedStaff: 1,
          attachments: 1,
          history: 1,
        },
      },
    ];

    const result = await ServiceRequestServices.getAggData(pipeline);
    console.log("result:", result);
    return res.render("admin/serviceRequest/viewServiceReq", {
      serviceRequest: result[0],
      title: result[0]?.title || "Service Request",
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
    const { staffIds = [] } = req.body;
    const adminId = req.user.id;

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
      isDeleted: false,
    });

    const staffList = await staffServices.getData({
      _id: {
        $in: staffIds,
      },
    });

    const assignedStaffIds = staffList.map((staff) => staff._id);
    const assignedAt = new Date();

    await ServiceRequestServices.updateOne(
      {
        _id: reqid,
        status: "pending",
        isDeleted: false,
      },
      {
        $set: {
          assignedStaffIds,
          acceptedStaffIds: [],
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
        assignedStaffIds: serviceRequest.assignedStaffIds || [],
        acceptedStaffIds: serviceRequest.acceptedStaffIds || [],
        status: serviceRequest.status,
        assignedAt: serviceRequest.assignedAt || null,
      },
      newValue: {
        assignedStaffIds,
        acceptedStaffIds: [],
        status: "assigned",
        assignedAt,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const staffIdsForEvent = staffList.map((staff) => staff._id);

    for (const staff of staffList) {
      await sendNotification({
        receiverId: staff.userId,
        senderId: adminId,
        requestId: serviceRequest._id,
        type: "request_assigned",
        room: `staff:${staff.userId}`,
        event: "service-request:assigned",
        data: {
          staffId: staff._id,
          staffIds: staffIdsForEvent,
          status: "assigned",
        },
      });
    }

    await sendNotification({
      receiverId: serviceRequest.userId,
      senderId: adminId,
      requestId: serviceRequest._id,
      type: "request_assigned",
      room: `user:${serviceRequest.userId}`,
      event: "service-request:assigned",
      data: {
        staffIds: staffIdsForEvent,
        staffCount: staffList.length,
        status: "assigned",
      },
    });

    await redisServices.delete(redisKeys.dashboard.stats());

    return successResponse(res, {
      statusCode: 200,
      message: "Service request assigned successfully.",
      data: {
        staffIds: staffIdsForEvent,
      },
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

export const updateRequestStatus = async (req, res) => {
  try {
    const { reqid } = req.params;
    const { status } = req.body;

    const userId = req.user.id;
    const role = req.user.role;

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
      isDeleted: false,
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

    const allowedStatuses = allowedTransitions[role]?.[currentStatus] || [];

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
        isDeleted: false,
      },
      {
        $set: updateData,
      },
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

    if (role !== "user") {
      await sendNotification({
        receiverId: serviceRequest.userId,
        senderId: userId,
        requestId: serviceRequest._id,
        type: "status_changed",
        room: `user:${serviceRequest.userId}`,
        event: "service-request:status-updated",
        data: {
          status,
          recipientType: "user",
        },
      });
    }

    if (role !== "staff" && serviceRequest.assignedStaffIds?.length) {
      const staffList = await staffServices.getData({
        _id: {
          $in: serviceRequest.assignedStaffIds,
        },
      });

      for (const staff of staffList) {
        await sendNotification({
          receiverId: staff.userId,
          senderId: userId,
          requestId: serviceRequest._id,
          type: "status_changed",
          room: `staff:${staff.userId}`,
          event: "service-request:status-updated",
          data: {
            status,
            recipientType: "staff",
          },
        });
      }
    }

    if (role !== "admin") {
      const admin = await userServices.getdatabyfindOne({
        role: "admin",
        isDeleted: false,
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
            status,
            recipientType: "admin",
          },
        });
      }
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
        $match: {
          isDeleted: false,
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
          localField: "assignedStaffIds",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                userId: 1,
                employeeId: 1,
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
        $lookup: {
          from: "staffs",
          localField: "acceptedStaffIds",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                userId: 1,
                employeeId: 1,
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
          as: "acceptedStaff",
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

          assignedStaff: {
            $map: {
              input: "$assignedStaff",
              as: "staff",
              in: {
                name: {
                  $trim: {
                    input: {
                      $concat: [
                        { $ifNull: ["$$staff.user.firstname", ""] },
                        " ",
                        { $ifNull: ["$$staff.user.lastname", ""] },
                      ],
                    },
                  },
                },
                employeeId: {
                  $ifNull: ["$$staff.employeeId", ""],
                },
              },
            },
          },

          acceptedStaff: {
            $map: {
              input: "$acceptedStaff",
              as: "staff",
              in: {
                name: {
                  $trim: {
                    input: {
                      $concat: [
                        { $ifNull: ["$$staff.user.firstname", ""] },
                        " ",
                        { $ifNull: ["$$staff.user.lastname", ""] },
                      ],
                    },
                  },
                },
                employeeId: {
                  $ifNull: ["$$staff.employeeId", ""],
                },
              },
            },
          },

          createdAt: 1,
          updatedAt: 1,
          assignedAt: 1,
          startedAt: 1,
          completedAt: 1,
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
        key: "assignedStaff",
        width: 35,
      },
      {
        header: "Assigned Employee ID",
        key: "assignedEmployeeId",
        width: 25,
      },
      {
        header: "Accepted Staff",
        key: "acceptedStaff",
        width: 35,
      },
      {
        header: "Accepted Employee ID",
        key: "acceptedEmployeeId",
        width: 25,
      },
      {
        header: "Assigned At",
        key: "assignedAt",
        width: 22,
      },
      {
        header: "Started At",
        key: "startedAt",
        width: 22,
      },
      {
        header: "Completed At",
        key: "completedAt",
        width: 22,
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
      const assignedStaff = request.assignedStaff || [];
      const acceptedStaff = request.acceptedStaff || [];

      worksheet.addRow({
        title: request.title || "",
        description: request.description || "",
        categoryName: request.categoryName || "",
        userName: request.userName || "",
        userEmail: request.userEmail || "",
        priority: request.priority || "",
        status: request.status || "",

        assignedStaff:
          assignedStaff
            .map((staff) => staff.name)
            .filter(Boolean)
            .join(", ") || "Not Assigned",

        assignedEmployeeId:
          assignedStaff
            .map((staff) => staff.employeeId)
            .filter(Boolean)
            .join(", ") || "",

        acceptedStaff:
          acceptedStaff
            .map((staff) => staff.name)
            .filter(Boolean)
            .join(", ") || "Not Accepted",

        acceptedEmployeeId:
          acceptedStaff
            .map((staff) => staff.employeeId)
            .filter(Boolean)
            .join(", ") || "",

        assignedAt: request.assignedAt ? new Date(request.assignedAt) : "",

        startedAt: request.startedAt ? new Date(request.startedAt) : "",

        completedAt: request.completedAt ? new Date(request.completedAt) : "",

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

    worksheet.getColumn("assignedAt").numFmt = "dd-mm-yyyy hh:mm";
    worksheet.getColumn("startedAt").numFmt = "dd-mm-yyyy hh:mm";
    worksheet.getColumn("completedAt").numFmt = "dd-mm-yyyy hh:mm";
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
      to: "P1",
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

export const deleteServiceRequest = async (req, res) => {
  try {
    const { reqid } = req.params;

    await ServiceRequestServices.updateOne(
      {
        _id: reqid,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
        },
      },
    );

    await redisServices.delete(redisKeys.dashboard.stats());

    return successResponse(res, {
      statusCode: 200,
      message: "Service request deleted successfully.",
    });
  } catch (error) {
    console.log("error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Unable to delete service request.",
      errors: error.message,
    });
  }
};

export const getServiceRequestForReassign = async (req, res) => {
  try {
    const { reqid } = req.params;

    const pipeline = [
      {
        $match: {
          _id: toObjectId(reqid),
          isDeleted: false,
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
          localField: "assignedStaffIds",
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
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          assignedStaffIds: 1,
          assignedStaff: 1,
          user: 1,
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
    console.log("getServiceRequestForReassign error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch service request",
      errors: error.message,
    });
  }
};

export const reassignRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { staffIds } = req.body;
    const adminId = req.user.id;

    const serviceRequest =
      await ServiceRequestServices.getdatabyfindOne({
        _id: requestId,
        isDeleted: false,
      });

   

    if (serviceRequest.status === "completed") {
      return errorResponse(res, {
        statusCode: 400,
        message: "Completed request cannot be reassigned.",
      });
    }

    const staffList = await staffServices.getData({
      _id: { $in: staffIds },
    });

    const newStaffIds = staffList.map(
      (staff) => staff._id,
    );

    const staffChanges = compareStaffIds({
      oldStaffIds: serviceRequest.assignedStaffIds,
      newStaffIds,
      oldAcceptedStaffIds: serviceRequest.acceptedStaffIds,
    });

    const {
      removedStaffIds,
      addedStaffIds,
      acceptedStaffIds,
    } = staffChanges;

    const assignedAt =
      serviceRequest.assignedAt || new Date();

    await ServiceRequestServices.updateOne(
      {
        _id: requestId,
        isDeleted: false,
      },
      {
        $set: {
          assignedStaffIds: newStaffIds,
          acceptedStaffIds,
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
        assignedStaffIds:
          serviceRequest.assignedStaffIds || [],
        acceptedStaffIds:
          serviceRequest.acceptedStaffIds || [],
        status: serviceRequest.status,
        assignedAt:
          serviceRequest.assignedAt || null,
      },

      newValue: {
        assignedStaffIds: newStaffIds,
        acceptedStaffIds,
        status: serviceRequest.status,
        assignedAt,
      },

      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const removedStaff = await staffServices.getData({
      _id: { $in: removedStaffIds },
    });

    const addedStaff = staffList.filter((staff) =>
      addedStaffIds.includes(
        staff._id.toString(),
      ),
    );

    await sendReassignmentNotifications({
      serviceRequest,
      adminId,
      removedStaff,
      addedStaff,
      staffList,
      status: serviceRequest.status,
    });

    await redisServices.delete(
      redisKeys.dashboard.stats(),
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Service request reassigned successfully.",
      data: {
        requestId: serviceRequest._id,
        staffIds: newStaffIds,
        acceptedStaffIds,
        status: serviceRequest.status,
      },
    });
  } catch (error) {
    console.log("reassignRequest error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to reassign service request.",
      errors: error.message,
    });
  }
};