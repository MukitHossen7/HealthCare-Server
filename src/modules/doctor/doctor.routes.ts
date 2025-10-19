import express from "express";
import { doctorController } from "./doctor.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const doctorsRoutes = express.Router();

doctorsRoutes.get("/", doctorController.getAllDoctors);

doctorsRoutes.patch(
  "/:id",
  checkAuth(UserRole.DOCTOR),
  doctorController.updateDoctors
);

export default doctorsRoutes;
