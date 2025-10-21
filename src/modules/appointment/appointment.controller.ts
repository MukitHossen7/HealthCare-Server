import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { appointmentServices } from "./appointment.service";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../../types/common";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user as IJwtPayload;
    const result = await appointmentServices.createAppointment(req.body, user);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointment Created successfully",
      data: result,
    });
  }
);

export const appointmentController = {
  createAppointment,
};
