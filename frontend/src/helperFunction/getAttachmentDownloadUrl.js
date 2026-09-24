const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export const getAttachmentUrl = (attachment) => {
  if (!attachment) {
    return "";
  }

  const filePath =
    attachment.filePath || attachment.url;

  if (!filePath) {
    return "";
  }

  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  return `${API_URL}${filePath}`;
};

export const getAttachmentDownloadUrl = (
  attachment
) => {
  if (!attachment?._id) {
    return getAttachmentUrl(attachment);
  }

  return `${API_URL}/attachment/download/${attachment._id}`;
};