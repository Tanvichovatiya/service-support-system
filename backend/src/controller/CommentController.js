import { getIo } from "../socket/initSocket.js";

import mongoose from "mongoose";

import { attachmentServices } from "../services/attachmentServices.js";
import { commentServices } from "../services/commentServices.js";
import notificationServices from "../services/notificationServices.js";
import ServiceRequestServices from "../services/ServiceRequestServices.js";
import staffServices from "../services/staffServcies.js";

import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { saveUploadedFiles } from "../utils/fileUploadHelper.js";

export const addComment = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { reqid } = req.params;
    const { message } = req.body;

    const io = getIo();

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
    });

    if (["cancelled", "completed"].includes(serviceRequest.status)) {
      return errorResponse(res, {
        statusCode: 400,
        message: `Cannot add comment when request is ${serviceRequest.status}.`,
      });
    }

    const trimmedMessage = message?.trim() || "";

    const files = Array.isArray(req.files) ? req.files : [];


    const comment = await commentServices.create({
      userId,
      requestId: serviceRequest._id,
      message: trimmedMessage,
      attachments: [],
    });

    let attachmentIds = [];

    if (files.length > 0) {
      try {
        attachmentIds = await saveUploadedFiles({ files, folder: "comments" });

        await commentServices.updateOne(
          {
            _id: comment._id,
          },
          {
            $set: {
              attachments: attachmentIds,
            },
          },
        );
      } catch (error) {
        console.error("Comment attachment error:", error);

        return errorResponse(res, {
          statusCode: 500,
          message: "Failed to save comment attachments.",
          errors: error.message,
        });
      }
    }

    if (role === "user") {
      if (serviceRequest.assignedStaffId) {
        const assignedStaff = await staffServices.getdatabyfindOne({
          _id: serviceRequest.assignedStaffId,
        });

        if (assignedStaff) {
          const staffNotification =
            await notificationServices.createNotification({
              receiverId: assignedStaff.userId,
              senderId: userId,
              requestId: serviceRequest._id,
              type: "new_comment",
              message: `User added a new comment to "${serviceRequest.title}".`,
            });

          io.to(`staff:${assignedStaff.userId}`).emit(
            "service-request:comment-added",
            {
              requestId: serviceRequest._id,
              notification: staffNotification.notification,
              unreadCount:staffNotification.unreadCount
            },
          );
        }
      }
    }

    if (role === "staff") {
      const userNotification = await notificationServices.createNotification({
        receiverId: serviceRequest.userId,
        senderId: userId,
        requestId: serviceRequest._id,
        type: "new_comment",
        message: `Staff added a new comment to "${serviceRequest.title}".`,
      });

      io.to(`user:${serviceRequest.userId}`).emit(
        "service-request:comment-added",
        {
          requestId: serviceRequest._id,
          notification: userNotification.notification,
          unreadCount:userNotification.unreadCount
        },
      );
    }

    if (role === "admin") {
      const userNotification = await notificationServices.createNotification({
        receiverId: serviceRequest.userId,
        senderId: userId,
        requestId: serviceRequest._id,
        type: "new_comment",
        message: `Admin added a new comment to "${serviceRequest.title}".`,
      });

      io.to(`user:${serviceRequest.userId}`).emit(
        "service-request:comment-added",
        {
          requestId: serviceRequest._id,
          notification: userNotification.notification,
          unreadCount:userNotification.unreadCount
        },
      );

      if (serviceRequest.assignedStaffId) {
        const assignedStaff = await staffServices.getdatabyfindOne({
          _id: serviceRequest.assignedStaffId,
        });

        if (assignedStaff) {
          const staffNotification =
            await notificationServices.createNotification({
              receiverId: assignedStaff.userId,
              senderId: userId,
              requestId: serviceRequest._id,
              type: "new_comment",
              message: `Admin added a new comment to "${serviceRequest.title}".`,
            });

          io.to(`staff:${assignedStaff.userId}`).emit(
            "service-request:comment-added",
            {
              requestId: serviceRequest._id,
              notification: staffNotification.notification,
              unreadCount:staffNotification.unreadCount
            },
          );
        }
      }
    }

    return successResponse(res, {
      statusCode: 201,
      message: "Comment added successfully.",
    
    });
  } catch (error) {
    console.error("addComment error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to add comment.",
      errors: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { reqid } = req.params;

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
    });

    const aggPipeline = [
     
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

          localField: "attachments",
          foreignField: "_id",

          as: "attachments",
        },
      },

      {
        $project: {
          _id: 1,

          requestId: 1,

          message: 1,

          createdAt: 1,

          updatedAt: 1,

          user: {
            _id: "$user._id",

            firstname: "$user.firstname",

            lastname: "$user.lastname",

            profilePic: "$user.profilePic",

            role: "$user.role",
          },
          attachments: {
            $map: {
              input: "$attachments",

              as: "attachment",

              in: {
                _id: "$$attachment._id",

                originalName: "$$attachment.originalName",

                fileName: "$$attachment.fileName",

                filePath: "$$attachment.filePath",

                mimeType: "$$attachment.mimeType",

                size: "$$attachment.size",

                createdAt: "$$attachment.createdAt",
              },
            },
          },
        },
      },

      {
        $sort: {
          createdAt: 1,
        },
      },
    ];

    const comments = await commentServices.getAggData(aggPipeline);

    return successResponse(res, {
      statusCode: 200,
      message: "Comments fetched successfully.",
      data: {
        requestId: serviceRequest._id,
        comments,
      },
    });
  } catch (error) {
    console.log("getComments error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch comments.",
      errors: error.message,
    });
  }
};
