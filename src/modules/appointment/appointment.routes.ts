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
  "/",
  checkAuth(UserRole.ADMIN),
  appointmentController.getAllAppointments
);

appointmentRoutes.get(
  "/my-appointment",
  checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
  appointmentController.getMyAppointment
);

appointmentRoutes.patch(
  "/status/:id",
  checkAuth(UserRole.DOCTOR),
  appointmentController.updateAppointmentStatus
);

export default appointmentRoutes;
