import { IJwtPayload } from "../../types/common";
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

const getDoctorSchedule = async () => {
  const result = await prisma.doctorSchedules.findMany({});
  return result;
};

export const doctorScheduleService = {
  createDoctorSchedule,
  getDoctorSchedule,
};
