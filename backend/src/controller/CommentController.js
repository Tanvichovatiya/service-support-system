

import mongoose from "mongoose";

import { commentServices } from "../services/commentServices.js";
import ServiceRequestServices from "../services/ServiceRequestServices.js";

import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { saveUploadedFiles } from "../utils/fileUploadHelper.js";
import { attachmentServices } from "../services/attachmentServices.js";

export const getComments = async (req, res) => {
  try {
    // const { id: userId, role } = req.user;
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
          let: {
            commentId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$commentId", "$$commentId"],
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

      {
        $project: {
          // _id: 1,
          // requestId: 1,
          message: 1,
          createdAt: 1,
          // updatedAt: 1,

          user: {
            _id: "$user._id",
            firstname: "$user.firstname",
            lastname: "$user.lastname",
            // profilePic: "$user.profilePic",
            role: "$user.role",
          },

          attachments: 1,
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

export const addComment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { reqid } = req.params;
    const { message } = req.body;

    const serviceRequest = await ServiceRequestServices.getdatabyfindOne({
      _id: reqid,
      isDeleted: false,
    });
 
    if (["cancelled", "completed"].includes(serviceRequest.status)) {
      return errorResponse(res, {
        statusCode: 400,
        message: `Cannot add comment when request is ${serviceRequest.status}.`,
      });
    }
    const files = Array.isArray(req.files) ? req.files : [];
    const comment = await commentServices.create({
      userId,
      requestId: serviceRequest._id,
      message,
    });
    if (files.length > 0) {
      try {
        const attachmentIds = await saveUploadedFiles({
          files,
          folder: "comments",
        });
        if (attachmentIds.length > 0) {
          await attachmentServices.updateMany(
            { _id: { $in: attachmentIds } },
            { $set: { commentId: comment._id } },
          );
        }
      } catch (error) {
        console.error("Comment attachment error:", error);
        return errorResponse(res, {
          statusCode: 500,
          message: "Failed to save comment attachments.",
          errors: error.message,
        });
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
