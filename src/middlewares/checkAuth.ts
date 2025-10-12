import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { prisma } from "../utils/prisma";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";

export const checkAuth =
  (...roles: string[]) =>
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization || req.cookies.accessToken;
      if (!token) {
        throw new AppError(401, "Access token is missing");
      }

      const verify_Token = verifyToken(
        token,
        config.JWT.ACCESS_TOKEN_SECRET
      ) as JwtPayload;
      if (!verify_Token) {
        throw new AppError(403, "Invalid access token");
      }

      const user = await prisma.user.findUnique({
        where: {
          email: verify_Token.email,
        },
      });
      if (!user) {
        throw new AppError(404, "Email does not exist");
      }

      if (
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.INACTIVE
      ) {
        throw new AppError(403, "Your account is blocked or inactive");
      }

      if (user.isDeleted === true) {
        throw new AppError(404, "Your account is deleted");
      }

      if (roles.length > 0 && !roles.includes(verify_Token.role)) {
        throw new AppError(403, "You are not authorized to access this route");
      }

      req.user = verify_Token;
      next();
    } catch (error) {
      next(error);
    }
  };
