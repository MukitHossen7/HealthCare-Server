"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const reviewRoutes = express_1.default.Router();
reviewRoutes.post("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.PATIENT), review_controller_1.reviewController.createReview);
reviewRoutes.get("/", review_controller_1.reviewController.getAllReviews);
exports.default = reviewRoutes;
