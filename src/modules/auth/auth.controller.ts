import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userSession = req.cookies;
  const result = await authServices.getMe(userSession);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User get own profile data successfully",
    data: result,
  });
});

const createLogin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.createLogin(payload);

  const userTokens = {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
  setAuthCookie(res, userTokens);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Your login is successfully",
    data: result,
  });
});

export const authController = {
  getMe,
  createLogin,
};
