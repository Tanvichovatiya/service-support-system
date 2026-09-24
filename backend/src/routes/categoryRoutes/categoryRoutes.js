
import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import { getActiveCategory, getCategories } from "../../controller/categoryController.js";


const categoryuserRoutes = Router()

categoryuserRoutes.get("/active",authMiddleware,authorize("user","admin"),getActiveCategory)

categoryuserRoutes.get("/get",authMiddleware,authorize("user"),getCategories)

export default categoryuserRoutes;