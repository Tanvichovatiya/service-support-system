import api from "./api";


//  /servicerequest/addcomment/reqid
export const addComment = async (requestId, formData) => {
  const response = await api.post(
    `/servicerequest/${requestId}/comments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

//  /servicerequest/getcomment/:reqid
export const getComments = async (requestId) => {
  const response = await axiosInstance.get(
    `/service-request/${requestId}/comments`
  );

  return response.data;
};