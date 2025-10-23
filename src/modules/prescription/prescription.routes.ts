import express from "express";
import { prescriptionController } from "./prescription.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const prescriptionRoutes = express.Router();

prescriptionRoutes.get(
  "/my-prescription",
  checkAuth(UserRole.PATIENT),
  prescriptionController.patientPrescription
);

prescriptionRoutes.post(
  "/",
  checkAuth(UserRole.DOCTOR),
  prescriptionController.createPrescription
);

export default prescriptionRoutes;
