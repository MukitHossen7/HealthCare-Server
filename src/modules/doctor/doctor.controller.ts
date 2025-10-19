import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { doctorServices } from "./doctor.service";
import sendResponse from "../../utils/sendResponse";
import { pick } from "../../utils/pick";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await doctorServices.getAllDoctors(options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors Retrieve successfully",
    data: result,
  });
});

export const doctorController = {
  getAllDoctors,
};
