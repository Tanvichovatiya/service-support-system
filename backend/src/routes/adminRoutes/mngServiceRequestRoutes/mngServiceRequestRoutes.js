

import { Router } from "express";

import authorize from "../../../middleware/authorize.middleware.js";
import {  assignRequest, deleteServiceRequest, exportServiceReqReport, getAllRequest, getRequestById, getRequestByIdData, getRequestComments, reassignRequest, renderNotificationPage, updateRequestStatus } from "../../../controller/adminController/mngServiceRequest.js";

import { authMiddleware } from "../../../middleware/authMiddleware.js";

const mngServiceRequestRoutes = Router()

mngServiceRequestRoutes.get("/",authMiddleware,authorize("admin"),getAllRequest);


mngServiceRequestRoutes.post("/exportreport",exportServiceReqReport)

mngServiceRequestRoutes.get("/notification",authMiddleware,authorize("admin"),renderNotificationPage)

mngServiceRequestRoutes.get('/:reqid',authMiddleware,authorize("admin"),getRequestById);

mngServiceRequestRoutes.get('/:reqid/data',authMiddleware,authorize("admin"),getRequestByIdData)

mngServiceRequestRoutes.post('/:reqid/assign',authMiddleware,authorize("admin"),assignRequest);

mngServiceRequestRoutes.patch("/:reqid/status",authMiddleware,authorize("admin","user","staff"),updateRequestStatus)

mngServiceRequestRoutes.delete("/delete/:reqid",authMiddleware,authorize("admin"),deleteServiceRequest)

mngServiceRequestRoutes.patch("/reassign/:reqid",authMiddleware,authorize("admin"),reassignRequest)

mngServiceRequestRoutes.get("/:reqid/comments",authMiddleware,authorize("admin"),getRequestComments)



export default mngServiceRequestRoutes;