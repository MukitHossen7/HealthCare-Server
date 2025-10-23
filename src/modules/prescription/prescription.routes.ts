import express from "express";
import { prescriptionController } from "./prescription.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const prescriptionRoutes = express.Router();

prescriptionRoutes.post(
  "/",
  checkAuth(UserRole.DOCTOR),
  prescriptionController.createPrescription
);

//get all prescription by patient
export default prescriptionRoutes;
