
import {Router} from "express"
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { downloadAttachment, viewAttachment } from "../../controller/attachmentController.js";
import authorize from "../../middleware/authorize.middleware.js";

const attachmentRoutes = Router();

attachmentRoutes.get("/download/:attachmentId",authMiddleware,downloadAttachment)

attachmentRoutes.get("/view/:attachmentId",authMiddleware,viewAttachment)

export default attachmentRoutes;