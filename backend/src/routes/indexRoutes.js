
import { Router } from "express";

import authIndexRoutes from "./authRoutes/authIndexRoutes.js";

import serviceRequestIndexRoutes from "./serviceRequestRoutes/serviceRequestIndexRoutes.js";
import categoryuserRoutes from "./categoryRoutes/categoryRoutes.js";
import profileRoutes from "./profileRoutes/profileRoutes.js";

import userRoutes from "./userRoutes/userRoutes.js";
import msgRoutes from "./msgRoutes/msgRoutes.js";
import attachmentRoutes from "./attachmentRoutes/attachmentRoutes.js";
import notificationRoutes from "./notificationRoutes/notificationRoutes.js";
import staffRoutes from "./staffRoutes/staffRoutes.js";

const indexRoutes = Router()

indexRoutes.use('/auth',authIndexRoutes)

indexRoutes.use("/servicerequest",serviceRequestIndexRoutes)

indexRoutes.use("/category",categoryuserRoutes)

indexRoutes.use("/profile",profileRoutes)

indexRoutes.use("/message",msgRoutes)

indexRoutes.use('/user',userRoutes);

indexRoutes.use("/attachment",attachmentRoutes)

indexRoutes.use('/notification',notificationRoutes)

indexRoutes.use("/staff",staffRoutes);

export default indexRoutes;