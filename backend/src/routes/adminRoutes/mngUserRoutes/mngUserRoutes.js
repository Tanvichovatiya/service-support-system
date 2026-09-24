import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware.js";
import authorize from "../../../middleware/authorize.middleware.js";
import { addUser, getAllUsers, getUserById ,deleteUser} from "../../../controller/adminController/mngUserController.js";
import { addUserValidator } from "../../../validators/AddUserValidator.js";
import { validate } from "../../../middleware/validate.js";


const mnguserRoutes = Router()

mnguserRoutes.post('/add',authMiddleware,authorize("admin"),addUserValidator,validate,addUser)

mnguserRoutes.get("/",authMiddleware,authorize("admin"),getAllUsers)

mnguserRoutes.get("/:id",authMiddleware,authorize("admin"),getUserById)

mnguserRoutes.delete('/:id/delete',authMiddleware,authorize("admin"),deleteUser)

export default mnguserRoutes;