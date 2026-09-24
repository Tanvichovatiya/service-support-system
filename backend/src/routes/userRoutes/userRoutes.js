
import {Router} from "express"
import { authMiddleware } from "../../middleware/authMiddleware.js"
import { getMyRequestStaff, getMyRequestUsers } from "../../controller/userController.js"
import authorize from "../../middleware/authorize.middleware.js"

const userRoutes = Router()

userRoutes.get("/getreqstaff",authMiddleware,authorize("user"),getMyRequestStaff)

userRoutes.get("/getrequser",authMiddleware,authorize("staff"),getMyRequestUsers)

export default userRoutes;