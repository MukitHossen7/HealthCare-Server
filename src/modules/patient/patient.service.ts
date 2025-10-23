import { Patient, Prisma } from "@prisma/client";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";
import { IJwtPayload } from "../../types/common";
import AppError from "../../errorHelpers/AppError";

const getAllPatient = async (options: TOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const searchFields = ["name", "email"];
  const { search, ...filterData } = filters;

  const andConditions: Prisma.PatientWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: searchFields.map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalData = await prisma.patient.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit: limit,
      total: totalData,
    },
    data: result,
  };
};

const getPatientById = async (id: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  return result;
};

const deletePatient = async (id: string) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const result = await prisma.user.update({
    where: {
      email: patientData.email,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const updatePatient = async (
  patientId: string,
  payload: any,
  user: IJwtPayload
) => {
  const { patientHealthData, medicalReport, ...patientInfo } = payload;
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  if (patientId !== patientData.id) {
    throw new AppError(
      403,
      "You are not authorized to update this patient information"
    );
  }

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.patient.update({
      where: {
        id: patientData.id,
      },
      data: patientInfo,
    });

    if (patientHealthData) {
      await tnx.patientHealthData.upsert({
        where: {
          patientId: patientData.id,
        },
        update: patientHealthData,
        create: {
          ...patientHealthData,
          patientId: patientData.id,
        },
      });
    }

    if (medicalReport) {
      await tnx.medicalReport.create({
        data: {
          ...medicalReport,
          patientId: patientData.id,
        },
      });
    }

    const updateData = await tnx.patient.findUnique({
      where: {
        id: patientData.id,
      },
      include: {
        patientHealthData: true,
        medicalReports: true,
      },
    });

    return updateData;
  });

  return result;
};

export const patientServices = {
  getAllPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
