import { UserStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { IAuth } from "./auth.interface";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import { createUserTokens } from "../../utils/userToken";

const createLogin = async (payload: IAuth) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(403, "User is not active");
  }
  if (user.isDeleted) {
    throw new AppError(410, "User has been deleted");
  }
  // if (!user.isVerified) {
  //   throw new AppError(401, "User email is not verified");
  // }

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password as string
  );
  if (!isCorrectPassword) {
    throw new AppError(401, "Incorrect password");
  }

  const tokenPayload = {
    email: user.email,
    role: user.role,
    id: user.id,
  };

  const userTokens = createUserTokens(tokenPayload);
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const authServices = {
  createLogin,
};
