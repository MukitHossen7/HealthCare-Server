"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorSchedule_controller_1 = require("./doctorSchedule.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const zodValidateRequest_1 = require("../../middlewares/zodValidateRequest");
const doctorSchedule_zod_validation_1 = require("./doctorSchedule.zod.validation");
const doctorScheduleRoutes = express_1.default.Router();
doctorScheduleRoutes.post("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.DOCTOR), (0, zodValidateRequest_1.zodValidateRequest)(doctorSchedule_zod_validation_1.createDoctorScheduleZodSchema), doctorSchedule_controller_1.doctorScheduleController.createDoctorSchedule);
doctorScheduleRoutes.get("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), doctorSchedule_controller_1.doctorScheduleController.getAllDoctorSchedule);
doctorScheduleRoutes.get("/my-schedule", (0, checkAuth_1.checkAuth)(client_1.UserRole.DOCTOR), doctorSchedule_controller_1.doctorScheduleController.getMyDoctorSchedule);
doctorScheduleRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.DOCTOR), doctorSchedule_controller_1.doctorScheduleController.deleteDoctorScheduleById);
exports.default = doctorScheduleRoutes;
