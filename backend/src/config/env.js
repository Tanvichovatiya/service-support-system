import dotenv from "dotenv";

dotenv.config();

const env = {
  
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 4000,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn : process.env.jwtExpiresIn,

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  email_user : process.env.EMAIL_USER,
  email_pass : process.env.EMAIL_PASS,

  redis_url:process.env.REDIS_URL,

  admin_email:process.env.ADMIN_EMAIL,
  admin_pass:process.env.ADMIN_PASS,
  session_secret: process.env.SESSION_SECRET,
  node_env:process.env.NODE_ENV

  
};

export default env;