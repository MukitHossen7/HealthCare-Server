import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { prescriptionServices } from "./prescription.service";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../../types/common";
import { pick } from "../../utils/pick";

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

const patientPrescription = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user as IJwtPayload;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await prescriptionServices.patientPrescription(
      user,
      options
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Patient Prescription Retrieve Successfully",
      data: {
        meta: result.meta,
        data: result.data,
      },
    });
  }
);

export const prescriptionController = {
  createPrescription,
  patientPrescription,
};
