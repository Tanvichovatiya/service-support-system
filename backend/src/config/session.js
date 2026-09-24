import session from "express-session";
import env from "./env.js";

const sessionConfig = session({
  secret: env.session_secret,

  resave: false,

  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: env.node_env === "production",
    maxAge: 1000 * 60 * 60 * 24, 
  },
});

export default sessionConfig;