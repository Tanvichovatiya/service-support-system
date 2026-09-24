import { body } from "express-validator";

export const registerValidator = [
  
  body("firstname").trim().notEmpty().withMessage("Firstname is required"),

  body("lastname").trim().notEmpty().withMessage("Lastname is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password").isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    }).withMessage("Password must be at least 6 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol"),

  body("gender").notEmpty().withMessage("gender is required")
];

export const verifyEmailValidator =[

  body("email").notEmpty().withMessage("email is required"),

  body("otp").notEmpty().withMessage("otp is required")

]

export const loginValidator =[

  body("email").notEmpty().withMessage("email is required"),
  body("password").notEmpty().withMessage("password is required")

]