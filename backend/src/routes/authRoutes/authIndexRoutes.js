import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { forgotPassword, login, registerUser, resetPassword, verifyEmail } from "../../controller/authController.js";
import { loginValidator, registerValidator, verifyEmailValidator } from "../../validators/authValidator.js";
import { uploadImage } from "../../utils/multer.js";
import { setPasswordValidator } from "../../validators/setPasswordValidator.js";
import loginRateLimit from "../../middleware/loginRateLmit.js";
import otpRateLimit from "../../middleware/otpRateLimit.js";



const authIndexRoutes = Router()

authIndexRoutes.post('/registeruser',uploadImage.single("profilePic"),registerValidator,validate,registerUser)

authIndexRoutes.post('/verifyemail',verifyEmailValidator,validate,otpRateLimit(),verifyEmail)

authIndexRoutes.post('/login',loginValidator,validate,loginRateLimit(),login)

authIndexRoutes.post("/set-password",setPasswordValidator,validate,resetPassword)

authIndexRoutes.post("/forgot-password",forgotPassword)

export default authIndexRoutes;