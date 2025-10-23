import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errorHelpers/AppError";
import { fileUploader } from "../../utils/fileUploader";
import { verifyToken } from "../../utils/jwt";
import { calculatePagination } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";
import {
  ICreateAdminInput,
  ICreateDoctorInput,
  ICreatePatientInput,
} from "./user.interface";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { UserStatus } from "@prisma/client";

const getAllUsers = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { search, ...filterData } = filters;

  const whereCondition: any = {
    email: search ? { contains: search, mode: "insensitive" } : undefined,
    role: filterData.role,
    status: filterData.status,
  };

  const users = await prisma.user.findMany({
    skip: skip,
    take: limit,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const totalData = await prisma.user.count({
    where: whereCondition,
  });
  return {
    meta: {
      page: page,
      limit: limit,
      total: totalData,
    },
    users,
  };
};

const getMe = async (userSession: any) => {
  const accessToken = userSession.accessToken;
  if (!accessToken) {
    throw new AppError(httpStatus.FORBIDDEN, "Access token is missing");
  }

  const decodedData = verifyToken(
    accessToken,
    config.JWT.ACCESS_TOKEN_SECRET
  ) as JwtPayload;

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }
  if (userData.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is deleted");
  }
  if (
    userData.status === UserStatus.BLOCKED ||
    userData.status === UserStatus.INACTIVE
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Your account is ${userData.status}`
    );
  }

  const {
    id,
    email,
    role,
    needPasswordChange,
    status,
    isDeleted,
    isVerified,
    createdAt,
    updatedAt,
  } = userData;

  return {
    id,
    email,
    role,
    needPasswordChange,
    status,
    isDeleted,
    isVerified,
    createdAt,
    updatedAt,
  };
};

const createPatient = async (
  payload: ICreatePatientInput,
  file?: Express.Multer.File
) => {
  if (file) {
    const upload = await fileUploader.uploadToCloudinary(file);
    payload.patient.profilePhoto = upload?.secure_url;
  }
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPTSALTROUND)
  );

  const createData = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.patient.email,
        password: hashPassword,
      },
    });

    const patientData = await tnx.patient.create({
      data: {
        name: payload.patient.name,
        email: payload.patient.email,
        contactNumber: payload.patient.contactNumber,
        gender: payload.patient.gender,
        profilePhoto: payload.patient.profilePhoto,
      },
    });

    return patientData;
  });

  return createData;
};

const createDoctor = async (
  payload: ICreateDoctorInput,
  file?: Express.Multer.File
) => {
  if (file) {
    const upload = await fileUploader.uploadToCloudinary(file);
    payload.profilePhoto = upload?.secure_url;
  }
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPTSALTROUND)
  );

  const createData = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
        role: "DOCTOR",
      },
    });

    const doctorData = await tnx.doctor.create({
      data: {
        name: payload.name,
        email: payload.email,
        contactNumber: payload.contactNumber,
        gender: payload.gender,
        profilePhoto: payload.profilePhoto,
        address: payload.address,
        registrationNumber: payload.registrationNumber,
        experience: payload.experience,
        appointmentFee: payload.appointmentFee,
        qualification: payload.qualification,
        currentWorkingPlace: payload.currentWorkingPlace,
        designation: payload.designation,
      },
    });

    return doctorData;
  });

  return createData;
};

const createAdmin = async (
  payload: ICreateAdminInput,
  file?: Express.Multer.File
) => {
  if (file) {
    const upload = await fileUploader.uploadToCloudinary(file);
    payload.profilePhoto = upload?.secure_url;
  }
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPTSALTROUND)
  );

  const createData = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
        role: "ADMIN",
        isVerified: true,
      },
    });

    const adminData = await tnx.admin.create({
      data: {
        name: payload.name,
        email: payload.email,
        contactNumber: payload.contactNumber,
        profilePhoto: payload.profilePhoto,
      },
    });

    return adminData;
  });

  return createData;
};

export const userServices = {
  getMe,
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
};
