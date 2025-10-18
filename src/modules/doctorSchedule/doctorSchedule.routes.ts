import express from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const doctorScheduleRoutes = express.Router();

doctorScheduleRoutes.post(
  "/",
  checkAuth(UserRole.DOCTOR),
  doctorScheduleController.createDoctorSchedule
);

export default doctorScheduleRoutes;
