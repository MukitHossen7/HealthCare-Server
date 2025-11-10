"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const meta_controller_1 = require("./meta.controller");
const metaRoutes = express_1.default.Router();
metaRoutes.get("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), meta_controller_1.metaController.getDashboardMetaData);
exports.default = metaRoutes;
