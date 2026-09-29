import { Router } from "express";
import { renderNotificationPage } from "../../../controller/adminController/notificationController.js";


const adminnotificationRoutes = Router()


adminnotificationRoutes.get("/",renderNotificationPage)

export default adminnotificationRoutes;