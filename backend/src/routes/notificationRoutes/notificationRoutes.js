
import {Router} from "express"
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { getUnreadNotificationCount, getUnreadNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../controller/NotificationController.js";
import authorize from "../../middleware/authorize.middleware.js";

const notificationRoutes = Router()

notificationRoutes.get("/getunread",authMiddleware,authorize("user","staff","admin"),getUnreadNotifications)

notificationRoutes.get("/getunreadcount",authMiddleware,authorize("user","staff","admin"),getUnreadNotificationCount);

notificationRoutes.patch("/read/:notificationId",authMiddleware,authorize("user","staff","admin"),markNotificationAsRead)

notificationRoutes.put("/markallread",authMiddleware,authorize("user","staff","admin"),markAllNotificationsAsRead)


export default notificationRoutes;