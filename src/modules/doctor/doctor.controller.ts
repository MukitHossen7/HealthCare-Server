import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { doctorServices } from "./doctor.service";
import sendResponse from "../../utils/sendResponse";
import { pick } from "../../utils/pick";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const filters = pick(req.query, [
    "search",
    "contactNumber",
    "experience",
    "gender",
    "appointmentFee",
  ]);
  const result = await doctorServices.getAllDoctors(options, filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors Retrieve successfully",
    data: {
      meta: result.meta,
      data: result.data,
    },
  });
});

const updateDoctors = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorServices.updateDoctors(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors Retrieve successfully",
    data: result,
  });
});

export const doctorController = {
  getAllDoctors,
  updateDoctors,
};
