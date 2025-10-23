import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewServices } from "./review.service";
import { IJwtPayload } from "../../types/common";

const createReview = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user as IJwtPayload;
    const result = await reviewServices.createReview(req.body, user);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Reviews Created successfully",
      data: result,
    });
  }
);

export const reviewController = {
  createReview,
};
