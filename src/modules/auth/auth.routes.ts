import express from "express";
import { authController } from "./auth.controller";

const authRoute = express.Router();

authRoute.post("/login", authController.createLogin);

//Home work create refresh-token

//Home work create change password

//Home work create forgot password

//Home work create reset password

export default authRoute;
