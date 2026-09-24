import api from "./api";

export const createServiceRequest = async (formData) => {
  try {
    console.log("data:", formData);
    const res = await api.post("/servicerequest/create", formData);
    return res.data.data;
  } catch (error) {
    console.log("create request error:", error);
    throw error;
  }
};

export const getMyRequests = async ({
  page = 1,
  search = "",
  status = "",
} = {}) => {
  try {
    const res = await api.get("/servicerequest/myrequests", {
      params: {
        page,
        search,
        status,
      },
    });

    return res.data.data;
  } catch (error) {
    console.error("Get my requests error:", error);
    throw error;
  }
};

export const getMyRequestById = async (reqid) => {
  try {
    const res = await api.get(`/servicerequest/${reqid}`);

    return res.data.data;
  } catch (error) {
    console.error("getMyRequestById error:", error);
    throw error;
  }
};

export const getAssignedRequests = async ({
  page = 1,
  status = "",
  priority = "",
  search = "",
}) => {
  try {
    const response = await api.get("/servicerequest/viewassign", {
      params: {
        page,
        status,
        priority,
        search,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log("err:", error);
    throw error;
  }
};

export const getAssignReqById = async (reqid) => {
  try {
    const res = await api.get(`/servicerequest/assign/${reqid}`);
    return res.data.data;
  } catch (error) {
    console.log("err:");
    throw error;
  }
};

export const acceptAssignedRequest = async (reqid) => {
  try {
    const res = await api.patch(`/servicerequest/accept/${reqid}`);
    return res.data;
  } catch (error) {
    console.log("acceptAssignedRequest error:", error);
    throw error;
  }
};

export const updateRequestStatus = async (reqid, status) => {
  try {
    const res = await api.patch(
      `/admin/servicerequest/${reqid}/status`,
      {
        status,
      }
    );

    return res.data.data;
  } catch (error) {
    console.log("updateRequestStatus error:", error);
    throw error;
  }
};

export const addComment = async (reqid, formData) => {
  try {
    const response = await api.post(
      `/servicerequest/addcomment/${reqid}`,formData);

    return response.data;
  } catch (error) {
    console.log("Add comment error:", error);
    throw error;
  }
};

export const getComment = async (reqid) =>{
  try {
    const response = await api.get(`/servicerequest/viewcomment/${reqid}`)
    return response.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error;
  }
}

export const getRequestHistroy = async(reqid) =>{
  try {
    const res = await api.get(`/servicerequest/histroy/${reqid}`);
    return res.data.data;
  } catch (error) {
    console.log("err:",error)
    throw error;
  }
}