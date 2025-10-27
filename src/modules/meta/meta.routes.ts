import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { metaController } from "./meta.controller";

const metaRoutes = express.Router();

metaRoutes.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  metaController.getDashboardMetaData
);

export default metaRoutes;
