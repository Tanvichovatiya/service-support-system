
import {Router} from "express"

import { authMiddleware } from "../../../middleware/authMiddleware.js";
import authorize from "../../../middleware/authorize.middleware.js";
import { getDashboard } from "../../../controller/adminController/dashboardController.js";


const dashboardRoutes = Router()

dashboardRoutes.get('/dashboard',getDashboard)

export default dashboardRoutes;