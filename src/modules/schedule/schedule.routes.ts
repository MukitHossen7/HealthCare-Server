import express from "express";
import { scheduleController } from "./schedule.controller";

const scheduleRoutes = express.Router();

scheduleRoutes.post("/", scheduleController.createSchedule);

scheduleRoutes.get("/", scheduleController.scheduleForDoctor);

export default scheduleRoutes;
