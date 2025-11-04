import express from "express";
import { authController } from "./auth.controller";

const authRoute = express.Router();

authRoute.get("/me", authController.getMe);

authRoute.post("/login", authController.createLogin);
authRoute.post("/refresh-token", authController.createNewAccessToken);

//Home work create change password

//Home work create forgot password

//Home work create reset password

export default authRoute;
