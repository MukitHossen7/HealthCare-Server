import { Admin, Doctor, Patient, UserRole, UserStatus } from "@prisma/client";
import config from "../../config";
import { IJwtPayload } from "../../types/common";
import { fileUploader } from "../../utils/fileUploader";
import { calculatePagination } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";
import {
  ICreateAdminInput,
  ICreateDoctorInput,
  ICreatePatientInput,
  IUpdateProfile,
} from "./user.interface";
import bcrypt from "bcryptjs";

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

const getMyProfile = async (user: IJwtPayload) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
      isDeleted: true,
      isVerified: true,
    },
  });

  let profileData;
  //patient
  if (userData.role === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({
      where: {
        email: userData.email,
      },
    });
  }

  // doctor
  if (userData.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({
      where: {
        email: userData.email,
      },
    });
  }

  //admin
  if (userData.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userData.email,
      },
    });
  }

  return {
    ...userData,
    ...profileData,
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

const changeProfileStatus = async (
  id: string,
  payload: { status: UserStatus }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const updateStatus = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      status: payload.status,
    },
  });
  return updateStatus;
};

const updateMyProfile = async (
  user: IJwtPayload,
  payload: IUpdateProfile,
  file?: Express.Multer.File
) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  let imageUrl;
  if (file) {
    const upload = await fileUploader.uploadToCloudinary(file);
    imageUrl = upload?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: {
        ...payload,
        ...(imageUrl && { profilePhoto: imageUrl }),
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: {
        ...payload,
        ...(imageUrl && { profilePhoto: imageUrl }),
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: {
        ...payload,
        ...(imageUrl && { profilePhoto: imageUrl }),
      },
    });
  }

  return {
    ...profileInfo,
  };
};

export const userServices = {
  getMyProfile,
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
  changeProfileStatus,
  updateMyProfile,
};
