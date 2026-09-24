import { hasheValue } from "../utils/hashValue.js";

import { userServices } from "../services/userServices.js";
import generateOtp from "../utils/generateOtp.js";
import otpServices from "../services/otpServices.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { comparepassword } from "../utils/comparePass.js";
import { sendMail } from "../utils/sendMail.js";
import { generateToken } from "../utils/jwt.js";

import { uploadToCloudinary } from "../utils/cloudinary.js";
import env from "../config/env.js";
import crypto from "crypto";
import { sendForgotPasswordMail } from "../utils/sendforgotPasswordMail.js";

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender } = req.body;

    const emailExists = await userServices.getdatabyfindOne({ email });

    if (emailExists) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Email already exists",
      });
    }
    let profilePic;

    if (req.file) {
      try {
        const cloudinaryRes = await uploadToCloudinary(req.file);
        console.log("cloudinary res:", cloudinaryRes);
        profilePic = cloudinaryRes.secure_url;
      } catch (err) {
        console.log("err:", err);
        throw new Error("Failed to upload image");
      }
    }

    const hashPassword = await hasheValue(password);

    const user = await userServices.createUser({
      firstname,
      lastname,
      email,
      password: hashPassword,
      gender,
      profilePic,
    });

    const otp = generateOtp();

    const hashOtp = await hasheValue(otp);

    await otpServices.createotp({
      userId: user._id,
      otp: hashOtp,
      purpose: "email_verification",
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      isUsed: false,
    });

    await sendMail({
      to: user.email,

      subject: "Service Support System - Email Verification",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Email Verification</title>
          </head>

          <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">

            <div style=" max-width: 600px; margin: 40px auto; background: #ffffff; padding: 30px;
                border-radius: 10px;">

              <h2>
                Welcome to Service Support System
              </h2>

              <p>
                Hello ${firstname},
              </p>

              <p>
                Thank you for registering.
                Please use the following OTP
                to verify your email address.
              </p>

              <div style=" margin: 25px 0; text-align: center; font-size: 32px; font-weight: bold;
                  letter-spacing: 8px;">
                ${otp}
              </div>

              <p>
                This OTP will expire in
                <strong>10 minutes</strong>.
              </p>

              <p>
                If you did not create this account,
                please ignore this email.
              </p>

              <hr />

              <p style="color: #777; font-size: 12px;">
                Service Support System
              </p>

            </div>

          </body>
        </html>
      `,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Registration successful. OTP has been sent to your email.",
      data: {
        userId: user._id,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("err:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "server err",
      errors: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userServices.getdatabyfindOne({ email });

    const otpData = await otpServices.getdatabyfindOne({
      userId: user._id,
      purpose: "email_verification",
      isUsed: false,
    });
    //  console.log("out data:",otpData)
    if (otpData.otpExpiry.getTime() < Date.now()) {
      return errorResponse(res, {
        statusCode: 400,
        message: "OTP has expired",
      });
    }
    const isOtpValid = await comparepassword(otp, otpData.otp);

    if (!isOtpValid) {
      return errorResponse(res, { statusCode: 400, message: "Invalid otp" });
    }

    await userServices.updateOne({ _id: user._id }, { isEmailVerified: true });

    await otpServices.updateOne({ _id: otpData._id }, { isUsed: true });

    return successResponse(res, {
      statusCode: 200,
      message: "Email verified Successfully",
    });
  } catch (error) {
    console.log("err:", error);
    return errorResponse(res, {
      statusCode: 500,
      message: "server err",
      errors: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userServices.getdatabyfindOne({ email });

    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Email not exists",
      });
    }

    if (!user.isEmailVerified) {
      return errorResponse(res, {
        statusCode: 403,
        message: "Email not verified",
      });
    }

    if (!user.isActive) {
      return errorResponse(res, {
        statusCode: 403,
        message: "Your account is inactive",
      });
    }

    const isPasswordValid = await comparepassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Invalid password",
      });
    }
    const token = generateToken({ id: user._id, role: user.role });

    const userData = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      profilePic: user.profilePic,
    };

    return successResponse(res, {
      statusCode: 200,
      message: "login Successfully",
      data: { token, user: userData },
    });
  } catch (error) {
    console.log("err:", error);
    return errorResponse(res, {
      statusCode: 500,
      message: "server err",
      errors: error,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userServices.getdatabyfindOne({
      passwordSetupToken: hashedToken,
      passwordSetupExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Invalid or expired password reset link.",
      });
    }

    const hashedPassword = await hasheValue(password);

    await userServices.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          password: hashedPassword,
          isEmailVerified: true,
        },
        $unset: {
          passwordSetupToken: "",
          passwordSetupExpires: "",
        },
      },
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.log("resetPassword error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to reset password.",
      errors: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //  console.log("email:",email)
    const user = await userServices.getData({ email });

    if (!user) {
      return successResponse(res, {
        statusCode: 200,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await userServices.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          passwordSetupToken: hashedResetToken,
          passwordSetupExpires: resetExpires,
        },
      },
    );

    const resetUrl = `${env.clientUrl}/set-password?token=${resetToken}`;

    await sendForgotPasswordMail({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      resetUrl,
    });

    await userServices.updateOne(
      {
        _id: user._id,
      },
      {
        $unset: {
          passwordSetupToken: "",
          passwordSetupExpires: "",
        },
      },
    );

    return successResponse(res, {
      statusCode: 200,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.log("forgotPassword error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to process forgot password request.",
      errors: error.message,
    });
  }
};
