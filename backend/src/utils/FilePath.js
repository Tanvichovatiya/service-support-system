import path from "path";
import { attachmentServices } from "../services/attachmentServices.js";

export const getAttachmentFilePath = async (attachmentId) => {
  const attachment = await attachmentServices.getDatabyId(attachmentId);

  if (!attachment) {
    const error = new Error("Attachment not found");
    error.statusCode = 404;
    throw error;
  }

  const relativePath = attachment.filePath.replace(/^[/\\]+/, "");

  const filePath = path.join(process.cwd(), relativePath);

  return {
    attachment,
    filePath,
  };
};