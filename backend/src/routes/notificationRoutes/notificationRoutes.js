
import {Router} from "express"
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { getUnreadNotificationCount, getUnreadNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../controller/NotificationController.js";

const notificationRoutes = Router()

notificationRoutes.get("/getunread",authMiddleware,getUnreadNotifications)

notificationRoutes.get("/getunreadcount",authMiddleware,getUnreadNotificationCount);

notificationRoutes.patch("/read/:notificationId",authMiddleware,markNotificationAsRead)

notificationRoutes.put("/markallread",authMiddleware,markAllNotificationsAsRead)


export default notificationRoutes;