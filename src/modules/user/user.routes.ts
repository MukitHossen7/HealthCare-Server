import express from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../utils/fileUploader";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { userZodValidation } from "./user.zod.validation";

const userRoute = express.Router();

userRoute.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  zodValidateRequest(userZodValidation.createPatientZodSchema),
  userController.createPatient
);

export default userRoute;
