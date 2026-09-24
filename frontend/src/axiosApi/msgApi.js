
import api from "./api"


export const getMyRequestStaff = async() =>{
  try {
    const res = await api.get("/user/getreqstaff")
    return res.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}

export const getMyrequestUser = async() =>{
  try {
    const res = await api.get("/user/getrequser")
    console.log("res:",res.data);
    return res.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error;
  }
}

export const loadMessages = async (receiverId) => {
  try {
    const res = await api.get(
      `/message/loadmsg/${receiverId}`
    );

    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const sendMsg = async (
  receiverId,
  message = "",
  file = null
) => {
  try {
    const formData = new FormData();

    formData.append("message", message);

    if (file) {
      formData.append("file", file);
    }

    const res = await api.post(
      `/message/sendmsg/${receiverId}`,
      formData
    );

    return res.data.data;
  } catch (error) {
    console.log("sendMsg error:", error);
    throw error;
  }
};

export const getUnReadMsg = async() =>{
  try {
    const res = await api.get("/message/getunreadmsg")
    return res.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}

