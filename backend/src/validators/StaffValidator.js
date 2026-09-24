
import { body } from "express-validator";

export const addStaffValidator =[

  body('firstname').notEmpty().withMessage("firstname is required").trim(),

  body("lastname").notEmpty().withMessage("lastname is required").trim(),

  body("email").notEmpty().withMessage("email is required").trim().normalizeEmail().isEmail().withMessage("Invalid email"),

  body("gender").notEmpty().withMessage("gender is required").trim(),

  body("employeeId").notEmpty().withMessage("employeeId is required").trim(),
   
  body("department").notEmpty().withMessage("department is required").trim(),
  
]


export const setUpStaffPasswordValidator = [

  body("token").notEmpty().withMessage("token is required"),

  body("password").notEmpty().withMessage("password is required")
]