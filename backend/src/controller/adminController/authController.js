import env from "../../config/env.js";
import { userServices } from "../../services/userServices.js";
import { generateToken } from "../../utils/jwt.js";



export const getLogin = async(req,res) =>{
  try {
    const error= req.query.error;
    return res.render("auth/login",{error,errors:{},formData:{}})
  } catch (error) {
    console.log("err:",error)
  }
}

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === env.admin_email && password === env.admin_pass) {

      // Find admin from MongoDB
      const admin = await userServices.getdatabyfindOne({
        email: env.admin_email,
        role: "admin",
      });

      if (!admin) {
        return res.redirect(
          "/admin/login?error=Admin%20not%20found"
        );
      }

      // Put MongoDB _id in JWT
      const token = await generateToken({
        id: admin._id,
        role: admin.role,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return res.redirect("/admin/dashboard");
    }

    return res.redirect(
      "/admin/login?error=Invalid%20credentials"
    );

  } catch (error) {
    console.log("err:", error);

    return res.redirect(
      "/admin/login?error=Server%20error"
    );
  }
};

export const logout = (req, res) => {
  try {

    res.clearCookie("token");
    return res.redirect("/admin/login");
    
  } catch (error) {
    console.log("err:", error);
  }
};
