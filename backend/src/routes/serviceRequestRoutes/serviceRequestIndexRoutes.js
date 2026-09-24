
import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { createServiceRequestValidator } from "../../validators/serviceRequestValidator.js";
import { validate } from "../../middleware/validate.js";
import { acceptAssignedRequest,  createRequest,  getAllReqofStaff, getAssignedRequestById, getMyRequestById, getMyRequests, getRequestHistory } from "../../controller/UserserviceRequest.js";
import authorize from "../../middleware/authorize.middleware.js";
import { uploadImageAndDocument } from "../../utils/multer.js";
import { addComment, getComments } from "../../controller/CommentController.js";
import { addCommentValidator } from "../../validators/commentValidator.js";


const serviceRequestIndexRoutes = Router()

serviceRequestIndexRoutes.post("/create",authMiddleware,authorize("user","admin"),uploadImageAndDocument.array("attachments"),createServiceRequestValidator,validate,createRequest)

serviceRequestIndexRoutes.get("/myrequests",authMiddleware,authorize("user"),getMyRequests)

serviceRequestIndexRoutes.get('/viewassign',authMiddleware,authorize("staff"),getAllReqofStaff)

serviceRequestIndexRoutes.get("/assign/:reqid",authMiddleware,authorize("staff"),getAssignedRequestById)

serviceRequestIndexRoutes.patch("/accept/:reqid",authMiddleware,authorize("staff"),acceptAssignedRequest)

serviceRequestIndexRoutes.get("/:reqid",authMiddleware,authorize("user"),getMyRequestById)


serviceRequestIndexRoutes.get('/histroy/:reqid',authMiddleware,getRequestHistory);

serviceRequestIndexRoutes.post("/addcomment/:reqid",authMiddleware,authorize("user","staff","admin"),uploadImageAndDocument.array("attachments"),addCommentValidator,validate,addComment)

serviceRequestIndexRoutes.get("/viewcomment/:reqid",authMiddleware,authorize("user","staff","admin"),getComments)




export default serviceRequestIndexRoutes;