import { Router } from "express";

import authorize from "../../../middleware/authorize.middleware.js";
import {  addStaff,editStaff,EditStaffStatus,getAllActiveStaff,getStaff, getStaffById, renderAddStaff, renderEditStaff,  } from "../../../controller/adminController/mngStaffController.js";

import { ValidateMiddleware } from "../../../middleware/admin/ValidateMiddleware.js";
import { addStaffValidator } from "../../../validators/StaffValidator.js";
import { authMiddleware } from "../../../middleware/authMiddleware.js";


const mngStaffRoutes = Router()

mngStaffRoutes.get('/',authMiddleware,authorize("admin"),getStaff)

mngStaffRoutes.get("/addStaff",authMiddleware,authorize("admin"),renderAddStaff)

mngStaffRoutes.post('/add',authMiddleware,authorize("admin"),addStaffValidator,ValidateMiddleware("admin/addStaff"),addStaff)

mngStaffRoutes.get('/active',authMiddleware,authorize("admin"),getAllActiveStaff)

mngStaffRoutes.patch("/:id/status",authMiddleware,authorize("admin"),EditStaffStatus)


mngStaffRoutes.get('/:id/edit',authMiddleware,authorize("admin"),renderEditStaff)

mngStaffRoutes.get("/:id",authMiddleware,authorize("admin"),getStaffById)

mngStaffRoutes.put("/:id/edit",authMiddleware,authorize("admin"),editStaff)

export default mngStaffRoutes;