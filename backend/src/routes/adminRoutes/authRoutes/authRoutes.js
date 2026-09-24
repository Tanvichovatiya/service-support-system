import { Router } from "express";
import { getLogin, Login, logout } from "../../../controller/adminController/authController.js";
import { loginValidator } from "../../../validators/authValidator.js";
import { ValidateMiddleware } from "../../../middleware/admin/ValidateMiddleware.js";



const authRoutes = Router()

authRoutes.get("/login",getLogin)

authRoutes.post("/login",loginValidator,ValidateMiddleware("auth/login"),Login)

authRoutes.get("/logout",logout)

export default authRoutes;