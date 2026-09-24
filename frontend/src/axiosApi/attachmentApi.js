


import api from "./api";

export const viewAttachment = async (attachmentId) => {
  if (!attachmentId) {
    throw new Error("Attachment ID is required");
  }

  const response = await api.get(
    `/attachment/view/${attachmentId}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

export const downloadAttachment = async (attachment) => {
  if (!attachment?._id) {
    throw new Error("Attachment ID is required");
  }

  const response = await api.get(
    `/attachment/download/${attachment._id}`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob(
    [response.data],
    {
      type:
        response.headers["content-type"] ||
        attachment.mimeType ||
        "application/octet-stream",
    }
  );

  const blobUrl =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = blobUrl;

  link.download =
    attachment.originalName ||
    attachment.fileName ||
    "attachment";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(blobUrl);
};