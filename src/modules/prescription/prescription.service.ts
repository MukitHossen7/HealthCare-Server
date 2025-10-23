import { AppointmentStatus, Prescription, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import { prisma } from "../../utils/prisma";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";

const createPrescription = async (
  user: IJwtPayload,
  payload: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === UserRole.DOCTOR) {
    if (user.email !== appointmentData.doctor.email) {
      throw new AppError(httpStatus.BAD_REQUEST, "This is not you appointment");
    }
  }
  const result = await prisma.prescription.create({
    data: {
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      appointmentId: appointmentData.id,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
  });

  return result;
};

export const prescriptionServices = {
  createPrescription,
};
