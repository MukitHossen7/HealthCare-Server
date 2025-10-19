import express from "express";
import { scheduleController } from "./schedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createScheduleZodSchema } from "./schedule.zod.validation";

const scheduleRoutes = express.Router();

scheduleRoutes.post(
  "/",
  checkAuth(UserRole.ADMIN),
  zodValidateRequest(createScheduleZodSchema),
  scheduleController.createSchedule
);

scheduleRoutes.get(
  "/",
  checkAuth(UserRole.DOCTOR, UserRole.ADMIN),
  scheduleController.scheduleForDoctor
);

scheduleRoutes.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  scheduleController.deleteSchedule
);

export default scheduleRoutes;
