import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string | undefined;

  const result = await userServices.getAllUsers({ limit, page, search });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Users retrieved successfully",
    data: {
      meta: result.meta,
      data: result.users,
    },
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const file = req.file;
  const result = await userServices.createPatient(payload, file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient Created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const file = req.file;
  const result = await userServices.createDoctor(payload, file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const file = req.file;
  const result = await userServices.createAdmin(payload, file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Created successfully",
    data: result,
  });
});

export const userController = {
  getAllUsers,
  createPatient,
  createDoctor,
  createAdmin,
};
