import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { appointmentServices } from "./appointment.service";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../../types/common";
import { pick } from "../../utils/pick";

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

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const user = req.user as IJwtPayload;

    const result = await appointmentServices.getMyAppointment(
      options,
      filters,
      user
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My Appointment Retrieve successfully",
      data: {
        meta: result.meta,
        data: result.data,
      },
    });
  }
);

export const appointmentController = {
  createAppointment,
  getMyAppointment,
};
