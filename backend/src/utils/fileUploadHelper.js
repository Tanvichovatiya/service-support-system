import fs from "fs";
import path from "path";
import crypto from "crypto";
import { attachmentServices } from "../services/attachmentServices.js";


export const saveUploadedFiles = async ({files = [],folder,}) => {

  if (!files.length) {
    return [];
  }

  const uploadDir = path.join(process.cwd(),"uploads",folder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
      recursive: true,
    });
  }

  const attachmentIds = [];

  try {
    for (const file of files) {
      const attachment =await saveUploadedFile({file,uploadDir,folder,});
      attachmentIds.push(attachment._id);
    }

    return attachmentIds;
  } catch (error) {
    console.log("saveUploadedFiles error:",error);
    throw error;
  }
};


const saveUploadedFile = async ({file,uploadDir,folder,}) => {
 
  const extension = path.extname(file.originalname);

  const uniqueName =`${Date.now()}-${crypto.randomUUID()}${extension}`;

  const physicalPath = path.join(uploadDir,uniqueName);

  fs.writeFileSync(physicalPath,file.buffer);

  const filePath =`/uploads/${folder}/${uniqueName}`;

  const attachment =await attachmentServices.createAttachment({
      originalName: file.originalname,
      fileName: uniqueName,
      filePath,
      mimeType: file.mimetype,
      size: file.size,
    });

  return attachment;
};