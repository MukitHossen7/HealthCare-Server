import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../utils/sendResponse";

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await doctorScheduleService.createDoctorSchedule(
      req.body,
      user
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Doctor Schedule Created successfully",
      data: result,
    });
  }
);

export const doctorScheduleController = {
  createDoctorSchedule,
};
