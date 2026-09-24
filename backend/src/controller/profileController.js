import { errorResponse, successResponse } from "../utils/apiResponse.js";

import { uploadToCloudinary } from "../utils/cloudinary.js";
import { userServices } from "../services/userServices.js";
import staffServices from "../services/staffServcies.js";

export const getUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = await userServices.getDatabyId(
      userId,
      "-password -passwordSetupToken -passwordSetupExpires -role -email -isEmailVerified ",
    );

    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "User not found",
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("err:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server error",
      errors: error.message,
    });
  }
};

export const getStaffProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = await userServices.getDatabyId(
      userId,
      "-password -passwordSetupToken -passwordSetupExpires  -role -email -isEmailVerified",
    );

    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "User not found",
      });
    }

    const staff = await staffServices.getdatabyfindOne({
      userId: userId,
    });

    const profile = {
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      profilePic: user.profilePic,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      isOnline: user.isOnline,

      employeeId: staff.employeeId,
      department: staff.department,
      skills: staff.skills,
    };

    return successResponse(res, {
      statusCode: 200,
      message: "Staff profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    console.log("getStaffProfile error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server error",
      errors: error.message,
    });
  }
};


export const editUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { firstname, lastname, gender } = req.body;

    const updateData = {};


    if (firstname !== undefined) {
      updateData.firstname = firstname.trim();
    }

    if (lastname !== undefined) {
      updateData.lastname = lastname.trim();
    }

    if (gender !== undefined) {
      updateData.gender = gender;
    }

    if (req.file) {
      try {
        const cloudinaryRes = await uploadToCloudinary(req.file);

        console.log("cloudinary res:", cloudinaryRes);

        updateData.profilePic = cloudinaryRes.secure_url;
      } catch (err) {
        console.log("img upload error:", err);

        return errorResponse(res, {
          statusCode: 500,
          message: "Failed to upload profile image",
          errors: err.message,
        });
      }
    }


    if (Object.keys(updateData).length === 0) {
      return errorResponse(res, {
        statusCode: 400,
        message: "No data provided for update",
      });
    }

 

    await userServices.updateOne(
      { _id: userId },
      updateData
    );



    return successResponse(res, {
      statusCode: 200,
      message: "User profile updated successfully",
    });

  } catch (error) {
    console.log(" error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server error",
      errors: error.message,
    });
  }
};


export const editStaffProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { firstname, lastname, gender, department, skills } = req.body;

    const userUpdateData = {};

    if (firstname !== undefined) {
      userUpdateData.firstname = firstname.trim();
    }

    if (lastname !== undefined) {
      userUpdateData.lastname = lastname.trim();
    }

    if (gender !== undefined) {
      userUpdateData.gender = gender;
    }

   
    if (req.file) {
      try {
        const cloudinaryRes = await uploadToCloudinary(req.file);

        console.log("cloudinary res:", cloudinaryRes);

        userUpdateData.profilePic = cloudinaryRes.secure_url;
      } catch (err) {
        console.log("img upload error:", err);

        return errorResponse(res, {
          statusCode: 500,
          message: "Failed to upload profile image",
          errors: err.message,
        });
      }
    }

    if (Object.keys(userUpdateData).length > 0) {
      await userServices.updateOne({ _id: userId }, userUpdateData);
    }

    const staffUpdateData = {};

    if (department !== undefined) {
      staffUpdateData.department = department.trim();
    }

    if (skills !== undefined) {
      staffUpdateData.skills = skills;
    }

    if (Object.keys(staffUpdateData).length > 0) {
      await staffServices.updateOne({ userId: userId }, staffUpdateData);
    }

  

    // const updatedUser = await userServices.getDatabyId(
    //   userId,
    //   "-password -passwordSetupToken -passwordSetupExpires",
    // );

    // const updatedStaff = await staffServices.getdatabyfindOne({
    //   userId: userId,
    // });

    // if (!updatedUser || !updatedStaff) {
    //   return errorResponse(res, {
    //     statusCode: 404,
    //     message: "Staff profile not found",
    //   });
    // }

    // const profile = {
    //   _id: updatedUser._id,
    //   firstname: updatedUser.firstname,
    //   lastname: updatedUser.lastname,
    //   email: updatedUser.email,
    //   gender: updatedUser.gender,
    //   profilePic: updatedUser.profilePic,
    //   role: updatedUser.role,
    //   isEmailVerified: updatedUser.isEmailVerified,
    //   isActive: updatedUser.isActive,
    //   isOnline: updatedUser.isOnline,

    //   employeeId: updatedStaff.employeeId,
    //   department: updatedStaff.department,
    //   skills: updatedStaff.skills,
    // };

    return successResponse(res, {
      statusCode: 200,
      message: "Staff profile updated successfully"
    });
  } catch (error) {
    console.log(" error:", error);

    return errorResponse(res, {
      statusCode: 500,
      message: "Server error",
      errors: error.message,
    });
  }
};
