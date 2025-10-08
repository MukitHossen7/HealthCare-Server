import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient Created successfully",
    data: result,
  });
});

export const userController = {
  createPatient,
};
