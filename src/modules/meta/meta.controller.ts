import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { metaServices } from "./meta.service";

const getDashboardMetaData = catchAsync(async (req: Request, res: Response) => {
  const result = await metaServices.getDashboardMetaData();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get dashboard metadata successfully",
    data: result,
  });
});

export const metaController = {
  getDashboardMetaData,
};
