import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { pick } from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { patientServices } from "./patient.service";
import { IJwtPayload } from "../../types/common";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["search", "gender"]);
  const result = await patientServices.getAllPatient(options, filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Patient Retrieve successfully",
    data: {
      meta: result.meta,
      data: result.data,
    },
  });
});

const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await patientServices.getPatientById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get Single Patient Retrieve successfully",
    data: result,
  });
});

const updatePatient = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const patientId = req.params.id;
    const user = req.user as IJwtPayload;
    const result = await patientServices.updatePatient(
      patientId,
      req.body,
      user
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Patient update successfully",
      data: result,
    });
  }
);

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await patientServices.deletePatient(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const patientController = {
  getAllPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
