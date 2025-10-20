import express from "express";
import { patientController } from "./patient.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const patientRoutes = express.Router();

patientRoutes.get("/", patientController.getAllPatient);

patientRoutes.get("/:id", patientController.getPatientById);

patientRoutes.patch(
  "/:id",
  checkAuth(UserRole.PATIENT, UserRole.ADMIN),
  patientController.updatePatient
);

patientRoutes.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  patientController.deletePatient
);

export default patientRoutes;
