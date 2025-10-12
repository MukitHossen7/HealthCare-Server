import config from "../../config";
import { fileUploader } from "../../utils/fileUploader";
import { calculatePagination } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";
import {
  ICreateAdminInput,
  ICreateDoctorInput,
  ICreatePatientInput,
} from "./user.interface";
import bcrypt from "bcryptjs";

const getAllUsers = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { search, ...filterData } = filters;

  const users = await prisma.user.findMany({
    skip: skip,
    take: limit,
    where: {
      email: {
        contains: search,
        mode: "insensitive",
      },
      role: filterData.role,
      status: filterData.status,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const totalData = await prisma.user.count();
  return {
    meta: {
      page: page,
      limit: limit,
      total: totalData,
    },
    users,
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
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
};
