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
    "specialties",
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

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorServices.deleteDoctor(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors deleted successfully",
    data: result,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorServices.getDoctorById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors retrieve By Id successfully",
    data: result,
  });
});

export const doctorController = {
  getAllDoctors,
  updateDoctors,
  deleteDoctor,
  getDoctorById,
};
