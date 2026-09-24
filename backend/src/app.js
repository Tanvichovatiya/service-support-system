
import express from 'express'
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import indexRoutes from './Routes/indexRoutes.js';
import notFoundMiddleware from './middleware/notFound.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';
import env from './config/env.js';
import { connectRedis } from './config/redis.js';
import adminIndexRoutes from './routes/adminRoutes/adminIndexRoutes.js';
import { seedAdmin } from './utils/seedAdmin.js';
import http from "http"
import { initSocket } from './socket/initSocket.js';
import apiRateLimit from './middleware/apiRateLimit.js';
import { startJobs } from './jobs/index.js';
import seedUsersAndStaff from './utils/seendUsersStaff.js';




dotenv.config()


const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
//app.use(apiRateLimit({limit:100,windowSeconds:15*60}))



app.use(cookieParser())

app.set("view engine","ejs")
app.set("views", "./views");

app.use(express.static("public"))

// seedAdmin()
// seedUsersAndStaff()
// seedOctoberRequests()

app.get("/",(req,res)=>res.redirect("/admin/login"))

app.use("/",indexRoutes)
app.use("/admin",adminIndexRoutes)
app.use(notFoundMiddleware)
app.use(errorMiddleware)

await connectDB()
await connectRedis()
startJobs()

const server = http.createServer(app)
initSocket(server)

const PORT = env.port || 4000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

