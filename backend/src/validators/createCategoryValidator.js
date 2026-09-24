import { body } from "express-validator";

export const createCategoryValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required"),

  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage(
      "Description cannot exceed 500 characters"
    ),
];