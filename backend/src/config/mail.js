import nodemailer from "nodemailer";
import env from "./env.js";

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:env.email_user,
    pass:env.email_pass
  } 
})

export default transporter;