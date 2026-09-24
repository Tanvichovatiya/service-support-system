
import fs from "fs"
import { errorResponse } from "../utils/apiResponse.js";
import { getAttachmentFilePath } from "../utils/FilePath.js";

export const viewAttachment = async (req,res) => {

  try {

    const { attachmentId } = req.params;

    const { attachment, filePath } =await getAttachmentFilePath(attachmentId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.sendFile(filePath);

  } catch (error) {

    console.log(" error:",error);

    return errorResponse(res,{statusCode:"500",message:"Server error",errors:error.message})
  }
};

export const downloadAttachment = async (req,res) => {

  try {
    const { attachmentId } = req.params;

    const { attachment, filePath } = await getAttachmentFilePath(attachmentId);
    console.log("attachmentId:",attachmentId,filePath)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.download(
      filePath,
      attachment.originalName ||
        attachment.fileName ||
        "attachment",
      (error) => {
        if (error) {
          console.error(
            "File download error:",
            error
          );

          if (!res.headersSent) {
            return res.status(500).json({
              success: false,
              message:
                "Unable to download file",
            });
          }
        }
      }
    );
  } catch (error) {

    console.log("downloadAttachment error:",error);

    return errorResponse(res,{statusCode:500,message:"server Err",errors:error.message})
  }
};
