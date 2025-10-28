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
  checkAuth(UserRole.ADMIN),
  doctorScheduleController.getAllDoctorSchedule
);

doctorScheduleRoutes.get(
  "/my-schedule",
  checkAuth(UserRole.DOCTOR),
  doctorScheduleController.getMyDoctorSchedule
);

doctorScheduleRoutes.delete(
  "/:id",
  checkAuth(UserRole.DOCTOR),
  doctorScheduleController.deleteDoctorScheduleById
);
export default doctorScheduleRoutes;
