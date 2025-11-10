"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("./appointment.controller");
const checkAuth_1 = require("./../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const appointmentRoutes = express_1.default.Router();
appointmentRoutes.post("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.PATIENT), appointment_controller_1.appointmentController.createAppointment);
appointmentRoutes.get("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), appointment_controller_1.appointmentController.getAllAppointments);
appointmentRoutes.get("/my-appointment", (0, checkAuth_1.checkAuth)(client_1.UserRole.PATIENT, client_1.UserRole.DOCTOR), appointment_controller_1.appointmentController.getMyAppointment);
appointmentRoutes.patch("/status/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.DOCTOR), appointment_controller_1.appointmentController.updateAppointmentStatus);
exports.default = appointmentRoutes;
