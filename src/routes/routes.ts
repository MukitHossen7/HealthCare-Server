import { Router } from "express";
import userRoute from "../modules/user/user.routes";
import authRoute from "../modules/auth/auth.routes";
import scheduleRoutes from "../modules/schedule/schedule.routes";
import doctorScheduleRoutes from "../modules/doctorSchedule/doctorSchedule.routes";
import specialtiesRoutes from "../modules/specialties/specialties.routes";
import doctorsRoutes from "../modules/doctor/doctor.routes";
import patientRoutes from "../modules/patient/patient.routes";
import adminRoutes from "../modules/admin/admin.routes";

const routes = Router();

routes.use("/user", userRoute);
routes.use("/auth", authRoute);
routes.use("/schedule", scheduleRoutes);
routes.use("/doctor-schedule", doctorScheduleRoutes);
routes.use("/specialties", specialtiesRoutes);
routes.use("/doctors", doctorsRoutes);
routes.use("/patients", patientRoutes);
routes.use("/admins", adminRoutes);

export default routes;
