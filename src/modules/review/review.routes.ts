import express from "express";
import { reviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const reviewRoutes = express.Router();

reviewRoutes.post(
  "/",
  checkAuth(UserRole.PATIENT),
  reviewController.createReview
);

reviewRoutes.get("/", reviewController.getAllReviews);
export default reviewRoutes;
