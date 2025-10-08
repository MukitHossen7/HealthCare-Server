import express from "express";
import { userController } from "./user.controller";

const userRoute = express.Router();

userRoute.post("/create-patient", userController.createPatient);

export default userRoute;
