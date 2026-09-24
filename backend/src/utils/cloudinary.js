import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadFromBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: options.resourceType || "auto",
        folder: options.folder || "chat",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    Readable.from([buffer]).pipe(uploadStream);
  });
};


export const uploadToCloudinary = (
  file,
  folder = "service-requests"
) => {
  return new Promise((resolve, reject) => {
    const isImage = file.mimetype?.startsWith("image/");

    const extension = file.originalname
      ?.split(".")
      .pop()
      ?.toLowerCase();

    const originalName = file.originalname
      ?.replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    const uniqueName = `${originalName}-${Date.now()}`;

    const uploadOptions = {
      folder,
      resource_type: isImage ? "image" : "raw",
      public_id: isImage
        ? uniqueName
        : `${uniqueName}.${extension}`,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};