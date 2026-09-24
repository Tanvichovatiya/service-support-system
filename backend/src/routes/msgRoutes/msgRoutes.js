

import {Router} from "express"
import { authMiddleware } from "../../middleware/authMiddleware.js"
import authorize from "../../middleware/authorize.middleware.js"
import { getUnReadMsg, loadMessage, sendMessage } from "../../controller/msgController.js"
import { uploadMessageFile } from "../../middleware/uploadMiddleware.js"

const msgRoutes = Router()

msgRoutes.post(
  "/sendmsg/:receiverId",
  authMiddleware,
  authorize("user", "staff"),
  uploadMessageFile.single("file"),
  sendMessage
);
msgRoutes.get("/conversation/:receiverId",authMiddleware,authorize("user","staff"),loadMessage)

msgRoutes.get("/getunreadmsg",authMiddleware,authorize("user","staff"),getUnReadMsg)

export default msgRoutes;