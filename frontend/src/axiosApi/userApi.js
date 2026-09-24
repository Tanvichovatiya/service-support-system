
import api from "./api";

export const getUserProfile = async () => {
  try {
    const response = await api.get("/profile/getuserprofile");
    return response.data.data;

  } catch (error) {
    console.log("Get user profile error:", error);
    throw error;
  }
};

export const getStaffProfile = async () => {
  try {
    const response = await api.get("/profile/getstaffprofile");
    return response.data.data;
  } catch (error) {
    console.log("Get staff profile error:", error);
    throw error;
  }
};

export const editUserProfile = async (formData) => {
  try {
    const response = await api.put(
      "/profile/edituserprofile",
      formData
    );

    return response.data;
  } catch (error) {
    console.log("Edit user profile error:", error);
    throw error;
  }
};

export const editStaffProfile = async (formData) => {
  try {
    const response = await api.put(
      "/profile/editstaffprofile",
      formData
    );

    return response.data;
  } catch (error) {
    console.log("Edit staff profile error:", error);
    throw error;
  }
};
