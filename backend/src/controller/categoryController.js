import { categoryServices } from "../services/categoryServices.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const getActiveCategory = async (req, res) => {
  try {
    const aggPipeline = [
      {
        $match: {
          isActive: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
     
    ];

    const aggResult = await categoryServices.getAggData(aggPipeline);

    return successResponse(res, {
      statusCode: 200,
      message: "Active categories fetched successfully",
      data: aggResult,
    });
  } catch (error) {
    console.error("Get active categories error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch active categories",
      errors: error.message,
    });
  }
};



export const getCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;

    const search = req.query.search?.trim() || "";

    const skip = (page - 1) * limit;

    const matchStage = {
      isActive: true,
    };

    if (search) {
      matchStage.$or = [
        {
          name: {
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
      ];
    }

    const aggPipeline = [
      {
        $match: matchStage,
      },
      {
        $sort: {
          name: 1,
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
                name: 1,
                description: 1,
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

    const aggResult = await categoryServices.getAggData(aggPipeline);

    const categories = aggResult[0]?.data || [];
    const total = aggResult[0]?.totalCount[0]?.count || 0;

    const totalPages = Math.ceil(total / limit);

    return successResponse(res, {
      statusCode: 200,
      message: "Categories fetched successfully",
      data: {
        categories,
        page,
        limit,
        totalCategories : total,
        totalPages,
      }
     
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to fetch categories",
      errors: error.message,
    });
  }
};
