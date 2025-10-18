import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../../types/common";

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user as IJwtPayload;
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

const getDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorScheduleService.getDoctorSchedule();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Schedule retrieve successfully",
    data: result,
  });
});

export const doctorScheduleController = {
  createDoctorSchedule,
  getDoctorSchedule,
};
