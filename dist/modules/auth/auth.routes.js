"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const authRoute = express_1.default.Router();
authRoute.get("/me", auth_controller_1.authController.getMe);
authRoute.post("/login", auth_controller_1.authController.createLogin);
authRoute.post("/refresh-token", auth_controller_1.authController.createNewAccessToken);
//Home work create change password
//Home work create forgot password
//Home work create reset password
exports.default = authRoute;
