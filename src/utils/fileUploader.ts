import multer from "multer";
import path from "path";
import { cloudinaryUpload } from "../config/cloudinary.config";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const normalizedPath = file.path.replace(/\\/g, "/");
  const baseName = path.parse(file.originalname).name.replace(/\s+/g, "_");
  const publicId = `healthcare_${baseName}_${uuidv4()}_${Date.now()}`;

  // Upload an image
  const uploadResult = await cloudinaryUpload.uploader
    .upload(normalizedPath, {
      public_id: publicId,
    })
    .catch((error) => {
      console.log(error);
    });
  return uploadResult;
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
