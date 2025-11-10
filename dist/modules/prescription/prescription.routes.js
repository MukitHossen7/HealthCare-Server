"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prescription_controller_1 = require("./prescription.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const prescriptionRoutes = express_1.default.Router();
prescriptionRoutes.get("/my-prescription", (0, checkAuth_1.checkAuth)(client_1.UserRole.PATIENT), prescription_controller_1.prescriptionController.patientPrescription);
prescriptionRoutes.post("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.DOCTOR), prescription_controller_1.prescriptionController.createPrescription);
exports.default = prescriptionRoutes;
