import multer from "multer";
import { fileTypeCheck } from "./fileTypeCheck.js";

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,

  fileFilter: fileTypeCheck([
    "jpg",
    "jpeg",
    "png",
    "webp",
  ]),

  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 5,
  },
});

export const uploadDocument = multer({
  storage,

  fileFilter: fileTypeCheck(["pdf"]),

  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 5,
  },
});

export const uploadImageAndDocument = multer({
  storage,

  fileFilter: fileTypeCheck([
    "jpg",
    "jpeg",
    "png",
    "webp",
    "pdf","doc","docx","txt",
  ]),

  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 5,
  },
});



export const uploadMessageFiles = multer({
  storage,

  fileFilter: fileTypeCheck([
    "jpg",
    "jpeg",
    "png",
    "webp",

    "pdf",

    "doc",
    "docx",
    "txt",

    "xls",
    "xlsx",

    "ppt",
    "pptx",
  ]),

  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 5,
  },
});