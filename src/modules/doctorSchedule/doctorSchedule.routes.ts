import express from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createDoctorScheduleZodSchema } from "./doctorSchedule.zod.validation";

const doctorScheduleRoutes = express.Router();

doctorScheduleRoutes.post(
  "/",
  checkAuth(UserRole.DOCTOR),
  zodValidateRequest(createDoctorScheduleZodSchema),
  doctorScheduleController.createDoctorSchedule
);

doctorScheduleRoutes.get(
  "/",
  checkAuth(UserRole.DOCTOR),
  doctorScheduleController.getDoctorSchedule
);

doctorScheduleRoutes.get(
  "/all",
  checkAuth(UserRole.ADMIN),
  doctorScheduleController.getAllDoctorSchedule
);

export default doctorScheduleRoutes;
