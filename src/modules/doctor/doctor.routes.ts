import express from "express";
import { doctorController } from "./doctor.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const doctorsRoutes = express.Router();

doctorsRoutes.post("/suggestion", doctorController.getAISuggestions);

doctorsRoutes.get("/", doctorController.getAllDoctors);

doctorsRoutes.get("/:id", doctorController.getDoctorById);

doctorsRoutes.patch(
  "/:id",
  checkAuth(UserRole.DOCTOR, UserRole.ADMIN),
  doctorController.updateDoctors
);

doctorsRoutes.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  doctorController.deleteDoctor
);

export default doctorsRoutes;
