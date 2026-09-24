import api from "./api"


export const registerUser = async(data) =>{
  try {
    // console.log("registr data:",data);
    const response = await api.post("/auth/registeruser",data)
    // console.log("register user res:",response.data)
    return response.data;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}

export const loginUser  = async(data)=>{
   try {
     const response = await api.post("/auth/login",data)
     return response.data.data;
   } catch (error) {
    console.log("err:",error)
    throw error
   }
}

export const setPasswordApi = async(data) =>{
  try {
    const  response = await api.post("/auth/set-password",data)
    return response;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}

export const VerifyEmail=async(data) =>{
  try {
    const response = await api.post("/auth/verifyemail",data)
    return response.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}

export const forgotPasswordApi = async(data) =>{
  try {
    const  response = await api.post("/auth/forgot-password",data)
    return response;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}