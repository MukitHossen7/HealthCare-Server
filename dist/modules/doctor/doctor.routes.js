"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctor_controller_1 = require("./doctor.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const doctorsRoutes = express_1.default.Router();
doctorsRoutes.post("/suggestion", doctor_controller_1.doctorController.getAISuggestions);
doctorsRoutes.get("/", doctor_controller_1.doctorController.getAllDoctors);
doctorsRoutes.get("/:id", doctor_controller_1.doctorController.getDoctorById);
doctorsRoutes.patch("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN), doctor_controller_1.doctorController.updateDoctors);
doctorsRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), doctor_controller_1.doctorController.deleteDoctor);
exports.default = doctorsRoutes;
