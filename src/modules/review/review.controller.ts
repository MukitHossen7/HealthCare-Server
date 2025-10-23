import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewServices } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.createReview(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Reviews Created successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};
