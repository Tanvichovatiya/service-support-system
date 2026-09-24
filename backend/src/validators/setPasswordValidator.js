

import { body } from "express-validator";

export const setPasswordValidator =[

  body("token").notEmpty().withMessage("token is required"),

  body("password").isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    }).withMessage("Password must be at least 6 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol"),
]

export const forgotPasswordValidator = [
  body("email").notEmpty().withMessage("Email is required")
]