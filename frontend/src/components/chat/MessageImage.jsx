"use client";

import { useEffect, useState } from "react";
import {
  FaDownload,
  FaSpinner,
} from "react-icons/fa";

import {
  viewAttachment,
  downloadAttachment,
} from "@/axiosApi/attachmentApi";

const MessageImage = ({ attachment }) => {

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] =useState(false);

  const fileName =attachment?.originalName ||attachment?.fileName ||"image";

  useEffect(() => {
    if (!attachment?._id) return;

    let objectUrl = null;

    const loadImage = async () => {
      try {
        setLoading(true);

        const blob = await viewAttachment(attachment._id);

        objectUrl =window.URL.createObjectURL(blob);

        setImageUrl(objectUrl);
      } catch (error) {
        console.log("Failed to load image:",error);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(
          objectUrl
        );
      }
    };
  }, [attachment?._id]);

  const handleDownload = async () => {
    if (downloading) return;

    try {
      setDownloading(true);

      await downloadAttachment(
        attachment
      );
    } catch (error) {
      console.log("Failed to download image:",error);
    } finally {
      setDownloading(false);
    }
  };

  if (!attachment?._id) {
    return null;
  }

  return (
    <div className="mt-2">
     

      {loading ? (
        <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-brand-soft">
          <FaSpinner
            size={20}
            className="animate-spin text-brand"
          />
        </div>
      ) : imageUrl ? (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl"
        >
          <img
            src={imageUrl}
            alt={fileName}
            className="block max-h-50 max-w-full cursor-pointer rounded-xl object-cover transition hover:opacity-95"
          />
        </a>
      ) : null}

   

      {!loading && imageUrl && (
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="mt-2 flex w-fit items-center gap-2 rounded-lg bg-brand-soft px-3 py-1.5 text-xs text-text-primary transition hover:bg-black/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {downloading ? (
            <FaSpinner
              size={12}
              className="animate-spin"
            />
          ) : (
            <FaDownload size={12} />
          )}

          <span>
            {downloading
              ? "Downloading..."
              : "Download"}
          </span>
        </button>
      )}
    </div>
  );
};

export default MessageImage;