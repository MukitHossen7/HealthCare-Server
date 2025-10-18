import { prisma } from "../../utils/prisma";

const createDoctorSchedule = async (payload: any, user: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  console.log(doctorData);
  console.log(payload);
};

export const doctorScheduleService = {
  createDoctorSchedule,
};
