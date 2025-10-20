import express from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const adminRoutes = express.Router();

adminRoutes.get("/", checkAuth(UserRole.ADMIN), adminController.getAllAdmin);

adminRoutes.get(
  "/:id",
  checkAuth(UserRole.ADMIN),
  adminController.getAdminById
);

adminRoutes.patch(
  "/:id",
  checkAuth(UserRole.ADMIN),
  adminController.updateAdmin
);

adminRoutes.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  adminController.deleteAdmin
);

export default adminRoutes;
