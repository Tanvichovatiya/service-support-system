
import { body } from "express-validator";

export const createServiceRequestValidator =[

  body("categoryId").notEmpty().withMessage("category id is requried"),

  body("title").notEmpty().withMessage("title is required"),

 
  
];

export const assignRequestValidator = [
 
  body("staffId")
    .notEmpty()
    .withMessage("Staff id is required")
 
];

export const updateRequestStatusValidator = [

 
  body("status")
    .notEmpty()
    .withMessage("Status is required")
   
];