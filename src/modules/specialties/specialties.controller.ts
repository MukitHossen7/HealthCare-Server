import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { specialtiesServices } from "./specialties.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const file = req.file;
  const result = await specialtiesServices.createSpecialties(payload, file);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Specialties created successfully!",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesServices.getAllSpecialties();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  // console.log(id);
  const result = await specialtiesServices.deleteSpecialties(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data deleted successfully",
    data: result,
  });
});

export const specialtiesController = {
  createSpecialties,
  getAllSpecialties,
  deleteSpecialties,
};
