import express from "express";
import { specialtiesController } from "./specialties.controller";
import { fileUploader } from "../../utils/fileUploader";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createSpecialtiesZodSchema } from "./specialties.zod.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const specialtiesRoutes = express.Router();

specialtiesRoutes.get("/", specialtiesController.getAllSpecialties);

specialtiesRoutes.post(
  "/",
  checkAuth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  zodValidateRequest(createSpecialtiesZodSchema),
  specialtiesController.createSpecialties
);

// Task 2: Delete Specialties Data by ID

/**
- Develop an API endpoint to delete specialties by ID.
- Implement an HTTP DELETE endpoint accepting the specialty ID.
- Delete the specialty from the database and return a success message.
- ENDPOINT: /specialties/:id
*/

specialtiesRoutes.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  specialtiesController.deleteSpecialties
);

export default specialtiesRoutes;
