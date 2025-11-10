"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const specialties_controller_1 = require("./specialties.controller");
const fileUploader_1 = require("../../utils/fileUploader");
const zodValidateRequest_1 = require("../../middlewares/zodValidateRequest");
const specialties_zod_validation_1 = require("./specialties.zod.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const specialtiesRoutes = express_1.default.Router();
specialtiesRoutes.get("/", specialties_controller_1.specialtiesController.getAllSpecialties);
specialtiesRoutes.post("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (0, zodValidateRequest_1.zodValidateRequest)(specialties_zod_validation_1.createSpecialtiesZodSchema), specialties_controller_1.specialtiesController.createSpecialties);
// Task 2: Delete Specialties Data by ID
/**
- Develop an API endpoint to delete specialties by ID.
- Implement an HTTP DELETE endpoint accepting the specialty ID.
- Delete the specialty from the database and return a success message.
- ENDPOINT: /specialties/:id
*/
specialtiesRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), specialties_controller_1.specialtiesController.deleteSpecialties);
exports.default = specialtiesRoutes;
