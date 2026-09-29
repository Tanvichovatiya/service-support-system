import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import { getStaffdashboard} from "../../controller/staffController.js";


const staffRoutes = Router()

staffRoutes.get("/dashboard",authMiddleware,authorize("staff"),getStaffdashboard)

export default staffRoutes;