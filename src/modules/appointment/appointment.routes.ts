import express from "express";
import { appointmentController } from "./appointment.controller";
import { checkAuth } from "./../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const appointmentRoutes = express.Router();

appointmentRoutes.post(
  "/",
  checkAuth(UserRole.PATIENT),
  appointmentController.createAppointment
);

appointmentRoutes.get(
  "/my-appointment",
  checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
  appointmentController.getMyAppointment
);

export default appointmentRoutes;
