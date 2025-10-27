import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { metaServices } from "./meta.service";
import { IJwtPayload } from "../../types/common";

const getDashboardMetaData = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user as IJwtPayload;
    const result = await metaServices.getDashboardMetaData(user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get dashboard metadata successfully",
      data: result,
    });
  }
);

export const metaController = {
  getDashboardMetaData,
};
