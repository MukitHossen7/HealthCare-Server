import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { IAuth } from "./auth.interface";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import {
  createNewAccessTokenUseRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import httpStatus from "http-status";
import { verifyToken } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

const getMe = async (userSession: any) => {
  const accessToken = userSession.accessToken;
  if (!accessToken) {
    throw new AppError(httpStatus.FORBIDDEN, "Access token is missing");
  }

  const decodedData = verifyToken(
    accessToken,
    config.JWT.ACCESS_TOKEN_SECRET
  ) as JwtPayload;

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      doctor: {
        select: {
          name: true,
          profilePhoto: true,
        },
      },
      patient: {
        select: {
          name: true,
          profilePhoto: true,
        },
      },
      admin: {
        select: {
          name: true,
          profilePhoto: true,
        },
      },
    },
  });

  const { id, email, role, needPasswordChange, status } = userData;

  let name = null;
  let profilePhoto = null;

  if (role === UserRole.DOCTOR) {
    name = userData.doctor?.name;
    profilePhoto = userData.doctor?.profilePhoto;
  } else if (role === UserRole.PATIENT) {
    name = userData.patient?.name;
    profilePhoto = userData.patient?.profilePhoto;
  } else if (role === UserRole.ADMIN) {
    name = userData.admin?.name;
    profilePhoto = userData.admin?.profilePhoto;
  }

  return {
    id,
    email,
    role,
    needPasswordChange,
    status,
    name,
    profilePhoto,
  };
};

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

const createNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenUseRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken.accessToken,
  };
};

export const authServices = {
  getMe,
  createLogin,
  createNewAccessToken,
};
