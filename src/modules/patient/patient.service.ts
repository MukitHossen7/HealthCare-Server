import { Prisma } from "@prisma/client";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";

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

const getPatientById = async (id: string) => {};

const updatePatient = async (id: string) => {};

const deletePatient = async (id: string) => {};

export const patientServices = {
  getAllPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
