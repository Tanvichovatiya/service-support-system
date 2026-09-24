import api from "./api"


export const getUnReadnotification = async(page=1,limit=10) =>{
  try {
    const res =await api.get("/notification/getunread",{
      params:{
        page,limit
      }
    }) 
    return res.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}

export const getUnReadCount = async() =>{
  try {
    const res = await api.get('/notification/getunreadcount')
    return res.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}

export const markReadApi = async(notificationId) =>{
  try {
    const res = await api.patch(`/notification/read/${notificationId}`)
    return res.data;
  } catch (error) {
    console.log("err:",error)
    throw error;
  }
}

export const markAllReadApi = async() =>{
  try {
    const res = await api.put("/notification/markallread")
    return res.data;
  } catch (error) {
    console.log("err:",error)
    throw error;
  }
}