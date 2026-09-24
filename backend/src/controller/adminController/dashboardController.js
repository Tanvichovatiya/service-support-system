
import redisServices from "../../services/redis/redisServices.js";
import ServiceRequestServices from "../../services/ServiceRequestServices.js";
import { userServices } from "../../services/userServices.js";
import { errorResponse } from "../../utils/apiResponse.js";
import { redisKeys } from "../../utils/redisKey.js";

export const getDashboard = async (req, res) => {
  try {
    const cacheKey = redisKeys.dashboard.stats();


    const cachedDashboard = await redisServices.getJson(cacheKey);

    if (cachedDashboard &&cachedDashboard.dashboard &&cachedDashboard.totalUsers !== undefined
    ) {
      console.log("Dashboard Cache HIT");

      return res.render("admin/dashboard", {
        totalUsers: cachedDashboard.totalUsers,
        dashboard: cachedDashboard.dashboard,
      });
    }

    console.log("Dashboard Cache MISS");

    const [totalUsers, result] = await Promise.all([
      userServices.countData(),

      ServiceRequestServices.getAggData([
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,

                  totalRequests: {
                    $sum: 1,
                  },

                  todayRequests: {
                    $sum: {
                      $cond: [
                        {
                          $gte: [
                            "$createdAt",
                            {
                              $dateTrunc: {
                                date: "$$NOW",
                                unit: "day",
                              },
                            },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },

                  pending: {
                    $sum: {
                      $cond: [
                        {
                          $eq: ["$status", "pending"],
                        },
                        1,
                        0,
                      ],
                    },
                  },

                  assigned: {
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

              {
                $project: {
                  _id: 0,
                  totalRequests: 1,
                  todayRequests: 1,
                  pending: 1,
                  assigned: 1,
                  inProgress: 1,
                  completed: 1,
                },
              },
            ],

            categoryWise: [
              {
                $group: {
                  _id: "$categoryId",
                  totalRequests: {
                    $sum: 1,
                  },
                },
              },

              {
                $lookup: {
                  from: "categories",
                  localField: "_id",
                  foreignField: "_id",
                  as: "category",
                },
              },

              {
                $unwind: "$category",
              },

              {
                $project: {
                  _id: "$category._id",
                  category: "$category.name",
                  totalRequests: 1,
                },
              },

              {
                $sort: {
                  totalRequests: -1,
                },
              },
            ],

            statusWise: [
              {
                $group: {
                  _id: "$status",
                  total: {
                    $sum: 1,
                  },
                },
              },

              {
                $project: {
                  _id: 0,
                  status: "$_id",
                  total: 1,
                },
              },

              {
                $sort: {
                  total: -1,
                },
              },
            ],

            monthly: [
              {
                $group: {
                  _id: {
                    year: {
                      $year: "$createdAt",
                    },
                    month: {
                      $month: "$createdAt",
                    },
                  },

                  totalRequests: {
                    $sum: 1,
                  },

                  completedRequests: {
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

                  pendingRequests: {
                    $sum: {
                      $cond: [
                        {
                          $eq: ["$status", "pending"],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },

              {
                $project: {
                  _id: 0,

                  year: "$_id.year",
                  month: "$_id.month",

                  totalRequests: 1,
                  completedRequests: 1,
                  pendingRequests: 1,
                },
              },

              {
                $sort: {
                  year: 1,
                  month: 1,
                },
              },
            ],

            topCategories: [
              {
                $group: {
                  _id: "$categoryId",
                  totalRequests: {
                    $sum: 1,
                  },
                },
              },

              {
                $lookup: {
                  from: "categories",
                  localField: "_id",
                  foreignField: "_id",
                  as: "category",
                },
              },

              {
                $unwind: "$category",
              },

              {
                $project: {
                  _id: "$category._id",
                  category: "$category.name",
                  totalRequests: 1,
                },
              },

              {
                $sort: {
                  totalRequests: -1,
                },
              },

              {
                $limit: 5,
              },
            ],

            staffPerformance: [
              {
                $match: {
                  assignedStaffId: {
                    $ne: null,
                  },
                },
              },

              {
                $group: {
                  _id: "$assignedStaffId",

                  assignedRequests: {
                    $sum: 1,
                  },

                  completedRequests: {
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

              {
                $lookup: {
                  from: "staffs",
                  localField: "_id",
                  foreignField: "_id",
                  as: "staff",
                },
              },

              {
                $unwind: {
                  path: "$staff",
                  preserveNullAndEmptyArrays: false,
                },
              },

              {
                $lookup: {
                  from: "users",
                  localField: "staff.userId",
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
                $project: {
                  _id: 0,

                  staffId: "$_id",

                  staffName: {
                    $concat: ["$user.firstname", " ", "$user.lastname"],
                  },

                  assignedRequests: 1,
                  completedRequests: 1,
                },
              },

              {
                $sort: {
                  completedRequests: -1,
                },
              },
            ],

            averageCompletionTime: [

              {
                $match: {
                  status: "completed",

                },
              },

              {
                $group: {
                  _id: null,

                  averageCompletionTime: {
                    $avg: {
                      $subtract: ["$completedAt", "$createdAt"],
                    },
                  },
                },
              },

              {
                $project: {
                  _id: 0,
                  averageCompletionTime: 1,
                },
              },
            ],
          },
        },
      ]),
    ]);

    const dashboardData = result?.[0] || {};

    const summary = dashboardData.summary?.[0] || {
      totalRequests: 0,
      todayRequests: 0,
      pending: 0,
      assigned: 0,
      inProgress: 0,
      completed: 0,
    };

    const averageCompletionTime =
      dashboardData.averageCompletionTime?.[0]?.averageCompletionTime || 0;

    const dashboard = {
      summary,

      categoryWise: dashboardData.categoryWise || [],

      statusWise: dashboardData.statusWise || [],

      monthly: dashboardData.monthly || [],

      topCategories: dashboardData.topCategories || [],

      staffPerformance: dashboardData.staffPerformance || [],

      averageCompletionTime,
    };



    // console.log("dashboard:",dashboard)
    await redisServices.setJson(
      cacheKey,
      {
        totalUsers,
        dashboard,
      },
      {
        EX: 300,
      },
    );

    console.log("Dashboard Cache set");

    return res.render("admin/dashboard", {
      totalUsers,
      dashboard,
    });
  } catch (error) {
    console.log("Dashboard Error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server Error",
      errors: error.message,
    });
  }
};
