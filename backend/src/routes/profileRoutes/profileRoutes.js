
import {Router} from "express"
import { authMiddleware } from "../../middleware/authMiddleware.js"
import authorize from "../../middleware/authorize.middleware.js"
import { editStaffProfile, editUserProfile, getStaffProfile, getUserProfile } from "../../controller/profileController.js"
import { uploadImage } from "../../utils/multer.js"

const profileRoutes = Router()

profileRoutes.get("/getuserprofile",authMiddleware,authorize("user"),getUserProfile)

profileRoutes.get("/getstaffprofile",authMiddleware,authorize("staff"),getStaffProfile)

profileRoutes.put('/edituserprofile',authMiddleware,authorize("user"),uploadImage.single("profilePic"),editUserProfile)

profileRoutes.put("/editstaffprofile",authMiddleware,authorize("staff"),uploadImage.single("profilePic"),editStaffProfile)

export default profileRoutes