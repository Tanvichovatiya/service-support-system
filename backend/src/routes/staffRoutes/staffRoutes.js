import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import { getStaffPerformance } from "../../controller/staffController.js";


const staffRoutes = Router()

staffRoutes.get("/performance",authMiddleware,authorize("staff"),getStaffPerformance)

export default staffRoutes;