import express from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../utils/fileUploader";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { userZodValidation } from "./user.zod.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const userRoute = express.Router();

userRoute.get("/", checkAuth(UserRole.ADMIN), userController.getAllUsers);

userRoute.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  zodValidateRequest(userZodValidation.createPatientZodSchema),
  userController.createPatient
);

userRoute.post(
  "/create-doctor",
  checkAuth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  zodValidateRequest(userZodValidation.createDoctorZodSchema),
  userController.createDoctor
);

// create admin home work
userRoute.post(
  "/create-admin",
  checkAuth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  zodValidateRequest(userZodValidation.createAdminZodSchema),
  userController.createAdmin
);

export default userRoute;
