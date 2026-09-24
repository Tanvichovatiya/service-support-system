import mongoose from "mongoose"
import env from "./env.js";

export const connectDB=async()=>{
  try {

    mongoose.connect(env.mongoUri);
    console.log("mongoDB connected successfully")

  } catch (error) {

    console.log("failed mongodb connection:",error.message)
    process.exit(1);
    
  }
}