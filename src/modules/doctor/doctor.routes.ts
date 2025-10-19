import express from "express";
import { doctorController } from "./doctor.controller";

const doctorsRoutes = express.Router();

doctorsRoutes.get("/", doctorController.getAllDoctors);

export default doctorsRoutes;
