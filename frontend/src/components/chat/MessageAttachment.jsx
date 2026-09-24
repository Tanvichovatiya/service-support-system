"use client";

import MessageImage from "./MessageImage";
import MessageFile from "./MessageFile";
import { getAttachmentUrl } from "@/helperFunction/getAttachmentDownloadUrl";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
]);

const MessageAttachment = ({ attachment }) => {
  if (!attachment) return null;

  const fileUrl = getAttachmentUrl(attachment);

  if (!fileUrl) return null;

  const mimeType = attachment.mimeType?.toLowerCase() || "";

  const extension =
    attachment.extension?.toLowerCase() ||
    attachment.fileName?.split(".").pop()?.toLowerCase() ||
    "";

  const isImage =
    mimeType.startsWith("image/") ||
    IMAGE_EXTENSIONS.has(extension);

  return isImage ? (
    <MessageImage attachment={attachment} />
  ) : (
    <MessageFile attachment={attachment} />
  );
};

export default MessageAttachment;