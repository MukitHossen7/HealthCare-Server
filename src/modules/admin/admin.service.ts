import { Admin, Prisma } from "@prisma/client";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";

const getAllAdmin = async (options: TOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const searchFields = ["name", "email"];
  const { search, ...filterData } = filters;

  const andConditions: Prisma.AdminWhereInput[] = [];

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

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalData = await prisma.admin.count({
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

const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  return result;
};

const updateAdmin = async (id: string, payload: Partial<Admin>) => {
  const adminData = await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id: adminData.id,
    },
    data: payload,
  });

  return result;
};

const deleteAdmin = async (id: string) => {
  const adminData = await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const result = await prisma.admin.delete({
    where: {
      id: adminData.id,
    },
  });

  return result;
};

export const adminServices = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
