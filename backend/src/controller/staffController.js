import ServiceRequestServices from "../services/ServiceRequestServices.js";
import staffServices from "../services/staffServcies.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

export const getStaffPerformance = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    const staff = await staffServices.getdatabyfindOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const staffId = staff._id;

    const result = await ServiceRequestServices.getAggData([
      {
        $match: {
          assignedStaffId: new mongoose.Types.ObjectId(staffId),
        },
      },

      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,

                totalAssigned: {
                   $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "assigned"],
                      },
                      1,
                      0,
                    ],
                  },
                },

                inProgress: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "in_progress"],
                      },
                      1,
                      0,
                    ],
                  },
                },

                completed: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "completed"],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],

          completionTime: [
            {
              $match: {
                status: "completed",

                startedAt: {
                  $ne: null,
                },

                completedAt: {
                  $ne: null,
                },
              },
            },

            {
              $project: {
                completionTimeMs: {
                  $subtract: ["$completedAt", "$startedAt"],
                },
              },
            },

            {
              $group: {
                _id: null,

                averageCompletionTimeMs: {
                  $avg: "$completionTimeMs",
                },
              },
            },
          ],

          recentRequests: [
            {
              $match:{
                status:"assigned"
              }
            },
            {
              $sort: {
                createdAt: -1,
              },
            },

            {
              $limit: 6,
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

                categoryId: 1,
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
              },
            },
          ],
        },
      },
    ]);

    const data = result[0] || {};
    const summary = data.summary?.[0] || {
      totalAssigned: 0,
      inProgress: 0,
      completed: 0,
    };

    const completionTime = data.completionTime?.[0] || {
      averageCompletionTimeMs: 0,
    };

    return successResponse(res, {
      statusCode: 200,
      message: "get data successfully ",
      data: {
        summary: {
          totalAssigned: summary.totalAssigned || 0,

          inProgress: summary.inProgress || 0,

          completed: summary.completed || 0,

          averageCompletionTimeMs: completionTime.averageCompletionTimeMs || 0,
        },

        recentRequests: data.recentRequests || [],
      },
    });
  } catch (error) {
    console.log("getStaffPerformance controller error:", error);
    return errorResponse(res, {
      statusCode: 500,
      message: "server err",
      errors: error.message,
    });
  }
};
