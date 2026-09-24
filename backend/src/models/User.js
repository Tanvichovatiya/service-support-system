import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },

    lastname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
      required: true,
    },

    profilePic: {
      type: String,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    passwordSetupToken: {
     type: String,
     default: null
    },

    passwordSetupExpires: {
     type: Date,
     default: null
    },
    isOnline:{
      type:Boolean,
      default:false
    }

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;