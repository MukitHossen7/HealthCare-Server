import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewServices } from "./review.service";
import { IJwtPayload } from "../../types/common";
import { pick } from "../../utils/pick";

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

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["patientEmail", "doctorEmail"]);
  const result = await reviewServices.getAllReviews(options, filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews All Reviews successfully",
    data: {
      meta: result.meta,
      data: result.data,
    },
  });
});

export const reviewController = {
  createReview,
  getAllReviews,
};
