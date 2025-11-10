"use strict";
// import multer from "multer";
// import path from "path";
// import { cloudinaryUpload } from "../config/cloudinary.config";
// import { v4 as uuidv4 } from "uuid";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), "/uploads"));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });
// const upload = multer({ storage: storage });
// const uploadToCloudinary = async (file: Express.Multer.File) => {
//   const normalizedPath = file.path.replace(/\\/g, "/");
//   const baseName = path.parse(file.originalname).name.replace(/\s+/g, "_");
//   const publicId = `healthcare_${baseName}_${uuidv4()}_${Date.now()}`;
//   // Upload an image
//   const uploadResult = await cloudinaryUpload.uploader
//     .upload(normalizedPath, {
//       public_id: publicId,
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   return uploadResult;
// };
// export const fileUploader = {
//   upload,
//   uploadToCloudinary,
// };
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const uuid_1 = require("uuid"); // ES Module compatible import
// Multer storage setup
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "/uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
const upload = (0, multer_1.default)({ storage });
// Cloudinary upload function
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const normalizedPath = file.path.replace(/\\/g, "/");
        const baseName = path_1.default.parse(file.originalname).name.replace(/\s+/g, "_");
        const publicId = `healthcare_${baseName}_${(0, uuid_1.v4)()}_${Date.now()}`;
        const uploadResult = yield cloudinary_config_1.cloudinaryUpload.uploader.upload(normalizedPath, {
            public_id: publicId,
        });
        return uploadResult;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
});
exports.fileUploader = {
    upload,
    uploadToCloudinary,
};
