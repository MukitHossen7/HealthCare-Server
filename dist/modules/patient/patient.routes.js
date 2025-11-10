"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_controller_1 = require("./patient.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const patientRoutes = express_1.default.Router();
patientRoutes.get("/", patient_controller_1.patientController.getAllPatient);
patientRoutes.get("/:id", patient_controller_1.patientController.getPatientById);
patientRoutes.patch("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.PATIENT), patient_controller_1.patientController.updatePatient);
patientRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), patient_controller_1.patientController.deletePatient);
exports.default = patientRoutes;
