import { validationResult } from "express-validator";

export const ValidateMiddleware = (viewName) => {
  return (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      return res.status(400).render(viewName, {    
        errors: errors.mapped(),
        formData: req.body,
        error:null
      });

    }

    next();
  };
};