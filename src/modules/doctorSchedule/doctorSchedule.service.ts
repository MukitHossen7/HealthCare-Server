import { Prisma, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";

const createDoctorSchedule = async (payload: any, user: IJwtPayload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId: string) => ({
    doctorId: doctorData.id,
    scheduleId: scheduleId,
  }));
  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });
  return result;
};

const getMyDoctorSchedule = async (
  user: IJwtPayload,
  filters: any,
  options: TOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (user.role === UserRole.DOCTOR && user.email) {
    andConditions.push({
      doctor: {
        email: user.email,
      },
    });
  }
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => {
        if (value === "true") value = true;
        else if (value === "false") value = false;
        return {
          [field]: {
            equals: value,
          },
        };
      }),
    });
  }

  const whereCondition: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    include: {
      schedule: true,
      doctor: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalData = await prisma.doctorSchedules.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: totalData,
    },
    data: result,
  };
};

const getAllDoctorSchedule = async (options: TOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { search, ...filterData } = filters;
  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (search) {
    andConditions.push({
      doctor: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => {
        if (value === "true") value = true;
        else if (value === "false") value = false;
        return {
          [field]: {
            equals: value,
          },
        };
      }),
    });
  }

  const whereCondition: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctor: true,
      schedule: true,
    },
  });
  const totalData = await prisma.doctorSchedules.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: totalData,
    },
    data: result,
  };
};

export const doctorScheduleService = {
  createDoctorSchedule,
  getMyDoctorSchedule,
  getAllDoctorSchedule,
};
