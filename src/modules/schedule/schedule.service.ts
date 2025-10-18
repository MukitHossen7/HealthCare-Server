import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../utils/prisma";
import { calculatePagination } from "../../utils/pagenationHelpers";
import { IJwtPayload } from "../../types/common";

const createSchedule = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const intervalTime = 30;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const schedules = [];

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: scheduleData,
      });
      if (!existingSchedule) {
        const createdSchedule = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(createdSchedule);
      }
      slotStartDateTime.setMinutes(
        slotStartDateTime.getMinutes() + intervalTime
      );
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const scheduleForDoctor = async (
  filters: any,
  options: any,
  user: IJwtPayload
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { startDateTime, endDateTime } = filters;
  console.log(user);
  const whereCondition: any = {
    AND: [
      {
        startDateTime: {
          gte: startDateTime,
        },
      },
      {
        endDateTime: {
          lte: endDateTime,
        },
      },
    ],
  };

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
    select: {
      scheduleId: true,
    },
  });

  const doctorSchedulesId = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  const result = await prisma.schedule.findMany({
    skip: skip,
    take: limit,
    where: {
      ...whereCondition,
      id: {
        notIn: doctorSchedulesId,
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const totalData = await prisma.schedule.count({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorSchedulesId,
      },
    },
  });
  return {
    meta: {
      page,
      limit,
      total: totalData,
    },
    result,
  };
};

const deleteSchedule = async (id: string) => {
  const result = await prisma.schedule.delete({
    where: {
      id: id,
    },
  });
  return result;
};

export const scheduleService = {
  createSchedule,
  scheduleForDoctor,
  deleteSchedule,
};
