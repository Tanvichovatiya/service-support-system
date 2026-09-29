

import { Router } from "express";

import authorize from "../../../middleware/authorize.middleware.js";
import {  assignRequest, deleteServiceRequest, exportServiceReqReport, getAllRequest, getRequestById, getServiceRequestForReassign, reassignRequest, updateRequestStatus } from "../../../controller/adminController/mngServiceRequest.js";

import { authMiddleware } from "../../../middleware/authMiddleware.js";

const mngServiceRequestRoutes = Router()

mngServiceRequestRoutes.get("/",authMiddleware,authorize("admin"),getAllRequest);


mngServiceRequestRoutes.post("/exportreport",exportServiceReqReport)


mngServiceRequestRoutes.get('/:reqid',authMiddleware,authorize("admin"),getRequestById);

mngServiceRequestRoutes.get('/:reqid/data',authMiddleware,authorize("admin"),getServiceRequestForReassign)

mngServiceRequestRoutes.post('/:reqid/assign',authMiddleware,authorize("admin"),assignRequest);

mngServiceRequestRoutes.patch("/:reqid/status",authMiddleware,authorize("admin","user","staff"),updateRequestStatus)

mngServiceRequestRoutes.delete("/delete/:reqid",authMiddleware,authorize("admin"),deleteServiceRequest)

mngServiceRequestRoutes.patch("/reassign/:requestId",authMiddleware,authorize("admin"),reassignRequest)




export default mngServiceRequestRoutes;