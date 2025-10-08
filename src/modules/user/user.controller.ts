import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  console.log("patient", req.body);
});

export const userController = {
  createPatient,
};
