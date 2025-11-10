"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedule_controller_1 = require("./schedule.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const zodValidateRequest_1 = require("../../middlewares/zodValidateRequest");
const schedule_zod_validation_1 = require("./schedule.zod.validation");
const scheduleRoutes = express_1.default.Router();
scheduleRoutes.post("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), (0, zodValidateRequest_1.zodValidateRequest)(schedule_zod_validation_1.createScheduleZodSchema), schedule_controller_1.scheduleController.createSchedule);
scheduleRoutes.get("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN), schedule_controller_1.scheduleController.scheduleForDoctor);
scheduleRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), schedule_controller_1.scheduleController.deleteSchedule);
exports.default = scheduleRoutes;
