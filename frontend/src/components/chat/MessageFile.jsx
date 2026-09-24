"use client";

import { useState } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
  FaDownload,
  FaSpinner,
} from "react-icons/fa";

import { downloadAttachment } from "@/axiosApi/attachmentApi";

const FILE_TYPES = {
  pdf: {
    extensions: ["pdf"],
    mimeTypes: ["application/pdf"],
    icon: FaFilePdf,
  },

  word: {
    extensions: ["doc", "docx"],
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    icon: FaFileWord,
  },

  excel: {
    extensions: ["xls", "xlsx", "csv"],
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ],
    icon: FaFileExcel,
  },

  powerpoint: {
    extensions: ["ppt", "pptx"],
    mimeTypes: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    icon: FaFilePowerpoint,
  },
};

const getFileIcon = (extension, mimeType) => {
  for (const type of Object.values(FILE_TYPES)) {
    if (
      type.extensions.includes(extension) ||
      type.mimeTypes.includes(mimeType)
    ) {
      return type.icon;
    }
  }

  return FaFileAlt;
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "0 B";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const MessageFile = ({ attachment }) => {

  const [downloading, setDownloading] = useState(false);

  if (!attachment?._id) return null;

  const extension =
    attachment.extension?.toLowerCase() ||
    attachment.fileName?.split(".").pop()?.toLowerCase() ||
    "";

  const mimeType = attachment.mimeType?.toLowerCase() || "";

  const Icon = getFileIcon(extension, mimeType);

  const fileName =
    attachment.originalName ||
    attachment.fileName ||
    "Attachment";

  const handleDownload = async () => {
    if (downloading) return;

    try {
      setDownloading(true);

      await downloadAttachment(attachment);
    } catch (error) {
      console.error("Failed to download attachment:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to download file"
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mt-2 flex w-[300px] max-w-full items-center gap-3 rounded-xl border border-border bg-surface-soft p-3">
    
      <div className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-brand-soft
          text-brand
        "
      >
        <Icon size={20} />
      </div>

      {/* FILE INFORMATION */}

      <div className="min-w-0 flex-1">
        <p
          className="
            truncate
            text-sm
            font-medium
            text-text-primary
          "
          title={fileName}
        >
          {fileName}
        </p>

        <p className="mt-0.5 text-xs text-text-muted">
          {extension
            ? extension.toUpperCase()
            : "FILE"}{" "}
          · {formatFileSize(attachment.size)}
        </p>
      </div>

      {/* DOWNLOAD */}

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-text-muted
          transition
          hover:bg-black/10
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        title={
          downloading
            ? "Downloading..."
            : "Download"
        }
        aria-label={
          downloading
            ? "Downloading file"
            : "Download file"
        }
      >
        {downloading ? (
          <FaSpinner
            size={14}
            className="animate-spin"
          />
        ) : (
          <FaDownload size={14} />
        )}
      </button>
    </div>
  );
};

export default MessageFile;