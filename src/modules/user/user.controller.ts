import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { pick } from "../../utils/pick";
import { IJwtPayload } from "../../types/common";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["search", "role", "status"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  // const limit = Number(req.query.limit) || 10;
  // const page = Number(req.query.page) || 1;
  // const search = req.query.search as string | undefined;
  // const sortBy = (req.query.sortBy || "createdAt") as string;
  // const sortOrder = (req.query.sortOrder || "desc") as string;
  // const role = req.query.role;
  // const status = req.query.status;

  const result = await userServices.getAllUsers(filters, options);
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

const getMyProfile = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user as IJwtPayload;
    const result = await userServices.getMyProfile(user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrieve my profile data successfully",
      data: result,
    });
  }
);

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

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Update user status successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user as IJwtPayload;
    const file = req.file;
    const payload = req.body;
    const result = await userServices.updateMyProfile(user, payload, file);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  }
);

export const userController = {
  getAllUsers,
  getMyProfile,
  createPatient,
  createDoctor,
  createAdmin,
  changeProfileStatus,
  updateMyProfile,
};
