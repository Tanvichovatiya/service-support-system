
import path from "path";

export const fileTypeCheck = (allowedTypes = []) => {

  return (req, file, cb) => {
    try {
      
      if (!file) {
        return cb(null, true);
      }

      const extension = path
        .extname(file.originalname)
        .toLowerCase()
        .replace(".", "");

      const mimeType = file.mimetype.toLowerCase();

      const isExtensionValid = allowedTypes.includes(extension);

      // const isMimeValid = allowedTypes.some((type) => {
      //   if (type === "jpg" || type === "jpeg") {
      //     return mimeType === "image/jpeg";
      //   }

      //   if (type === "png") {
      //     return mimeType === "image/png";
      //   }

      //   if (type === "webp") {
      //     return mimeType === "image/webp";
      //   }

      //   if (type === "pdf") {
      //     return mimeType === "application/pdf";
      //   }

      //   return false;
      // });

      if (!isExtensionValid ) {
        return cb(
          new Error(
            `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
          ),
          false
        );
      }

      return cb(null, true);
    } catch (error) {
      return cb(error, false);
    }
  };
};