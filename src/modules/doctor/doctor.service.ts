import { Prisma } from "@prisma/client";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";

const getAllDoctors = async (options: TOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const searchFields = ["name", "email"];
  const { search, ...filterFields } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (search) {
    const searchResult = {
      OR: searchFields.map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    };
    andConditions.push(searchResult);
  }

  if (Object.keys(filterFields).length) {
    const filterResult = {
      AND: Object.entries(filterFields).map(([field, value]) => {
        if (["experience", "appointmentFee"].includes(field)) {
          value = Number(value);
        }
        return {
          [field]: {
            equals: value,
          },
        };
      }),
    };
    andConditions.push(filterResult);
  }

  const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.doctor.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const doctorServices = {
  getAllDoctors,
};
