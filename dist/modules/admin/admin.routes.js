"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const adminRoutes = express_1.default.Router();
adminRoutes.get("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), admin_controller_1.adminController.getAllAdmin);
adminRoutes.get("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), admin_controller_1.adminController.getAdminById);
adminRoutes.patch("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), admin_controller_1.adminController.updateAdmin);
adminRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), admin_controller_1.adminController.deleteAdmin);
exports.default = adminRoutes;
