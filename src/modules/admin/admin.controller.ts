import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { pick } from "../../utils/pick";
import { adminServices } from "./admin.service";
import sendResponse from "../../utils/sendResponse";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["search", "contactNumber", "name"]);
  const result = await adminServices.getAllAdmin(options, filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Admin Retrieve successfully",
    data: {
      meta: result.meta,
      data: result.data,
    },
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adminServices.getAdminById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get Single Admin Retrieve successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adminServices.updateAdmin(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin update successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adminServices.deleteAdmin(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const adminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
