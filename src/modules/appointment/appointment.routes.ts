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

export default appointmentRoutes;
