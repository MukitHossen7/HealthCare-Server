import { AppointmentStatus, Prescription, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import { prisma } from "../../utils/prisma";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";

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

const patientPrescription = async (user: IJwtPayload, options: TOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const prescriptionData = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      patient: true,
      doctor: true,
    },
  });

  const totalData = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
  });

  return {
    meta: {
      page,
      limit: limit,
      total: totalData,
    },
    data: prescriptionData,
  };
};

export const prescriptionServices = {
  createPrescription,
  patientPrescription,
};
