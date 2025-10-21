import { Appointment } from "@prisma/client";
import { IJwtPayload } from "../../types/common";

const createAppointment = async (
  payload: Partial<Appointment>,
  user: IJwtPayload
) => {
  console.log(payload);
  console.log(user);
};

export const appointmentServices = {
  createAppointment,
};
