import { body } from "express-validator";


export const addUserValidator = [

  body("firstname").trim().notEmpty().withMessage("firstname is required"),

  body("lastname").trim().notEmpty().withMessage("lastname is required"),

  body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("Please enter a valid email"),

  body('gender').trim().notEmpty().withMessage("gender is required")

]