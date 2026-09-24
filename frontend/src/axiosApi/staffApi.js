import api from "./api";


export const  getStaffPerformance = async() =>{
  try {
    const  res= await api.get("/staff/performance");
    return res.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}