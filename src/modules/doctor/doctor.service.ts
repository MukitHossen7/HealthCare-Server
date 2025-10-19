import { Prisma } from "@prisma/client";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

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
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
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

const updateDoctors = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const { specialties, ...doctorData } = payload;
  const isDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  if (specialties && specialties.length > 0) {
    const deleteSpecialtyIds = specialties.filter(
      (specialty) => specialty.isDeleted
    );

    for (const specialty of deleteSpecialtyIds) {
      await prisma.doctorSpecialties.deleteMany({
        where: {
          doctorId: isDoctor.id,
          specialtiesId: specialty.specialtyId,
        },
      });
    }
    const createSpecialtyIds = specialties.filter(
      (specialty) => !specialty.isDeleted
    );

    for (const specialty of createSpecialtyIds) {
      await prisma.doctorSpecialties.create({
        data: {
          doctorId: isDoctor.id,
          specialtiesId: specialty.specialtyId,
        },
      });
    }
  }

  const updateDoctor = await prisma.doctor.update({
    where: {
      id: id,
    },
    data: doctorData,
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return updateDoctor;
};

export const doctorServices = {
  getAllDoctors,
  updateDoctors,
};
