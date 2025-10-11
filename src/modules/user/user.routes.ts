import express from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../utils/fileUploader";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { userZodValidation } from "./user.zod.validation";

const userRoute = express.Router();

userRoute.get("/", userController.getAllUsers);

userRoute.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  zodValidateRequest(userZodValidation.createPatientZodSchema),
  userController.createPatient
);

userRoute.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  zodValidateRequest(userZodValidation.createDoctorZodSchema),
  userController.createDoctor
);

// create admin home work
userRoute.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  zodValidateRequest(userZodValidation.createAdminZodSchema),
  userController.createAdmin
);

export default userRoute;
