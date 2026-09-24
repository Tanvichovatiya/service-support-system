import api from "./api";


export const getCategories = async (page = 1, search = "") => {
  try {
    const res = await api.get("/category/get", {
      params: {
        page,
        search,
      },
    });

    return res.data.data;
  } catch (error) {
    console.log("Get categories error:", error);
    throw error;
  }
};



export const getActiveCategories = async() =>{
  try {
    const res = await api.get("/category/active")
    return res.data.data
  } catch (error) {
    console.log("err:",error)
    throw error
  }
}