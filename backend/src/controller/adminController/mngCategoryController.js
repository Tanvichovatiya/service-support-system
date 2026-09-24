import mongoose from "mongoose";
import { auditLogServices } from "../../services/auditLogServices.js";
import { categoryServices } from "../../services/categoryServices.js";
import redisServices from "../../services/redis/redisServices.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";

import {
  redirectSuccess,
  renderError,
  renderServerError,
} from "../../utils/ejsResponse.js";
import { redisKeys } from "../../utils/redisKey.js";
import { getChanges } from "../../utils/auditLogHelper.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingcategory = await categoryServices.getdatabyfindOne({ name });

    if (existingcategory) {
      return renderError(res, {
        statusCode: 400,
        view: "admin/category/index",
        errors: {
          name: {
            msg: "Category already exists",
          },
        },
        formData: req.body,
      });
    }
    const category = await categoryServices.create({ name, description });

    await redisServices.delete(redisKeys.category.all());

    await auditLogServices.create({
      userId: req.user.id,
      action: "CATEGORY_CREATED",
      entity: "Category",
      entityId: category._id,
      oldValue: null,
      newValue: {
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      },

      ipAddress: req.ip,

      userAgent: req.get("user-agent"),
    });
   
    return successResponse(res, {
      statusCode: 201,
      message: "Category created successfullyss",
      data: category,
    });
  } catch (error) {
    console.log("err:", error);
    return errorResponse(res, {
      statusCode: 500,
      message: "Unable to create category",
    });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const existingCategory = await categoryServices.getDatabyId(id);

    const duplicateCategory = await categoryServices.getdatabyfindOne({
      name: name.trim(),
      _id: { $ne: id },
    });

    if (duplicateCategory) {
      return renderError(res, {
        statusCode: 400,
        view: "/admin/category/edit",
        errors: {
          name: {
            msg: "Category already exists",
          },
        },
        formData: req.body,
      });
    }
    const updateData = {
      name: name.trim() || "",
      description: description?.trim() || "",
    };

    if (isActive !== undefined) {
      updateData.isActive = isActive === true || isActive === "true";
    }

    const { oldValue, newValue } = getChanges(existingCategory, updateData, [
      "name",
      "description",
      "isActive",
    ]);

    await categoryServices.updateOne({ _id: id }, { $set: updateData });

    await redisServices.delete(redisKeys.category.all());

    await redisServices.delete(redisKeys.category.byId(id));


    await auditLogServices.create({
      userId: req.user.id,
      action: "CATEGORY_UPDATED",
      entity: "Category",
      entityId: id,
      oldValue: oldValue,
      newValue: newValue,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Category updated successfully",
    });

  } catch (error) {
    console.log("edit category err:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Unable to update category",
    });
  }
};

export const getCategoryForEdit = async (req, res) => {
  try {
    const { id } = req.params;

    let category = await redisServices.getJson(redisKeys.category.byId(id));

    if (!category) {
      category = await categoryServices.getDatabyId(id);

      if (!category) {
        return errorResponse(res, {
          statusCode: 404,
          message: "Category not found",
        });
      }

      await redisServices.setJson(redisKeys.category.byId(id), category, {
        EX: 300,
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("getCategoryForEdit error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Unable to load category",
    });
  }
};

export const EditCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
   
    const existingCategory = await categoryServices.getDatabyId(id);

    const newStatus = !existingCategory.isActive;

    await categoryServices.updateOne(
      { _id: id },
      {
        $set: {
          isActive: newStatus,
        },
      },
    );

    await redisServices.delete(redisKeys.category.all());

    await redisServices.delete(redisKeys.category.byId(id));

    await auditLogServices.create({
      userId: req.user.id,

      action: newStatus ? "CATEGORY_ACTIVATED" : "CATEGORY_DEACTIVATED",

      entity: "Category",

      entityId: existingCategory._id,

      oldValue: {
        isActive: existingCategory.isActive,
      },

      newValue: {
        isActive: newStatus,
      },

      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // return redirectSuccess(res, {
    //   url: "/admin/category",
    //   message: newStatus
    //     ? "Category activated successfully"
    //     : "Category deactivated successfully",
    // });
    return res.redirect("/admin/category");
  } catch (error) {
    console.error(" error:", error);

    return res.redirect("/admin/category");
  }
};

export const getCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();
    const status = req.query.status || "";
    const sort = req.query.sort || "newest";

    const matchStage = {};

    if (search) {
      matchStage.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (status === "active") {
      matchStage.isActive = true;
    }

    if (status === "inactive") {
      matchStage.isActive = false;
    }

    let sortStage;

    switch (sort) {
      case "oldest":
        sortStage = {
          createdAt: 1,
          _id: 1,
        };
        break;

      case "most_requests":
        sortStage = {
          totalRequests: -1,
          createdAt: -1,
          _id: 1,
        };
        break;

      case "least_requests":
        sortStage = {
          totalRequests: 1,
          createdAt: 1,
          _id: 1,
        };
        break;

      case "newest":
      default:
        sortStage = {
          createdAt: -1,
          _id: 1,
        };
        break;
    }

    const aggregation = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "servicerequests",
          let: {
            categoryId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$categoryId", "$$categoryId"],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "requestStats",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          isActive: 1,
          totalRequests: {
            $ifNull: [
              {
                $arrayElemAt: ["$requestStats.count", 0],
              },
              0,
            ],
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: sortStage,
      },
      {
        $facet: {
          categories: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          totalCategories: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const aggResult = await categoryServices.getAggData(aggregation);

    const data = aggResult[0] || {};

    const categories = data.categories || [];

    const totalCategories =
      data.totalCategories?.[0]?.count || 0;

    const totalPages = Math.ceil(totalCategories / limit);

    const pagination = {
      page,
      limit,
      totalItems: totalCategories,
      totalPages,
    };

    return res.render("admin/category/index", {
      categories,
      pagination,
      query: {
        search,
        status,
        sort,
      },
      baseUrl: "/admin/category",
      errors: {},
      formData: {},
    });
  } catch (error) {
    console.error("getCategories error:", error);

    return renderServerError(res, {
      statusCode: 500,
      view: "admin/category/index",
      message: "Unable to load categories",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;


    const cacheKey = redisKeys.category.byId(id);

    let category  = await redisServices.getJson(cacheKey);
   
    if (!category) {
      const result = await categoryServices.getAggData([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },

        {
          $lookup: {
            from: "servicerequests",
            localField: "_id",
            foreignField: "categoryId",
            as: "requests",
          },
        },

        {
          $addFields: {
            totalRequests: {
              $size: "$requests",
            },
          },
        },

        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            isActive: 1,
            totalRequests: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

      category = result[0];
      await redisServices.setJson(cacheKey, category, {
        EX: 300,
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("getCategoryById error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server error",
      errors: error.message,
    });
  }
};
