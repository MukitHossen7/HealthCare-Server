import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { prescriptionServices } from "./prescription.service";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../../types/common";

const createPrescription = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user as IJwtPayload;
    const payload = req.body;
    const result = await prescriptionServices.createPrescription(user, payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Create Prescription successfully",
      data: result,
    });
  }
);

export const prescriptionController = {
  createPrescription,
};
