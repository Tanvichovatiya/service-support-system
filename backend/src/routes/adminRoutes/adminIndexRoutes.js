
import { Router } from "express";
import mngStaffRoutes from "./mngStaffRoutes/mngStaffRoutes.js";
import authRoutes from "./authRoutes/authRoutes.js";
import dashboardRoutes from "./dashboardRoutes/dashboardRoutes.js";
import mngCategoryRoutes from "./mngCategoryRoutes/mngCategoryRoute.js";
import mngServiceRequestRoutes from "./mngServiceRequestRoutes/mngServiceRequestRoutes.js";
import mnguserRoutes from "./mngUserRoutes/mngUserRoutes.js";



const adminIndexRoutes = Router()

adminIndexRoutes.use("/",authRoutes)
adminIndexRoutes.use("/staff",mngStaffRoutes)
adminIndexRoutes.use("/",dashboardRoutes);
adminIndexRoutes.use('/category',mngCategoryRoutes)
adminIndexRoutes.use('/servicerequest',mngServiceRequestRoutes)
adminIndexRoutes.use('/user',mnguserRoutes)

export default adminIndexRoutes;