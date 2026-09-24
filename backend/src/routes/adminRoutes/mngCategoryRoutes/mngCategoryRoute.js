import { Router } from "express";

import authorize from "../../../middleware/authorize.middleware.js";
import { createCategoryValidator } from "../../../validators/createCategoryValidator.js";
import { ValidateMiddleware } from "../../../middleware/admin/ValidateMiddleware.js";
import { createCategory, editCategory, getCategories, getCategoryForEdit, EditCategoryStatus, getCategoryById} from "../../../controller/adminController/mngCategoryController.js";
import { authMiddleware } from "../../../middleware/authMiddleware.js";

const mngCategoryRoutes = Router();

mngCategoryRoutes.get("/",authMiddleware,authorize("admin"),getCategories)
mngCategoryRoutes.get('/:id/edit',authMiddleware,authorize("admin"),getCategoryForEdit)


mngCategoryRoutes.post(
  "/create",
   authMiddleware,
  authorize("admin"),
  createCategoryValidator,
  ValidateMiddleware("admin/categories/create"),
  createCategory,
);
mngCategoryRoutes.put("/:id/edit",authMiddleware,authorize("admin"),editCategory)

mngCategoryRoutes.post("/:id/status",authMiddleware,authorize("admin"),EditCategoryStatus)

mngCategoryRoutes.get('/:id',authMiddleware,authorize("admin"),getCategoryById)


export default mngCategoryRoutes;
