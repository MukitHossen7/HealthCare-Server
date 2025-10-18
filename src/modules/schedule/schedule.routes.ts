import express from "express";
import { scheduleController } from "./schedule.controller";

const scheduleRoutes = express.Router();

scheduleRoutes.post("/", scheduleController.createSchedule);

scheduleRoutes.get("/", scheduleController.scheduleForDoctor);

scheduleRoutes.delete("/:id", scheduleController.deleteSchedule);

export default scheduleRoutes;
