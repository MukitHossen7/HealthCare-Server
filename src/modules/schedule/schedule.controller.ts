import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { scheduleService } from "./schedule.service";
import { pick } from "../../utils/pick";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.createSchedule(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule Created successfully",
    data: result,
  });
});

const scheduleForDoctor = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await scheduleService.scheduleForDoctor(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule For Doctor Retrieve successfully",
    data: result,
  });
});

export const scheduleController = {
  createSchedule,
  scheduleForDoctor,
};
