import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const createLogin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.createLogin(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Your login is successfully",
    data: result,
  });
});

export const authController = {
  createLogin,
};
