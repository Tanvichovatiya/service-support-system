

import { body } from "express-validator";

export const addCommentValidator = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Comment message is required")
];