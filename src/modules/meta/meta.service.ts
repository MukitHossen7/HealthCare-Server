import { PaymentStatus, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { prisma } from "../../utils/prisma";

const getDashboardMetaData = async (user: IJwtPayload) => {
  let metadata;

  switch (user.role) {
    case UserRole.ADMIN:
      metadata = "admin meta data";
      break;
    case UserRole.DOCTOR:
      metadata = "doctor meta data";
      break;
    case UserRole.PATIENT:
      metadata = "patient meta data";
      break;
    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid user role");
  }
  return metadata;
};

const getAdminMetaData = async () => {
  const totalPatient = await prisma.patient.count();
  const totalDoctor = await prisma.doctor.count();
  const totalAdmin = await prisma.admin.count();
  const totalAppointment = await prisma.appointment.count();
  const totalPayment = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });
};

export const metaServices = {
  getDashboardMetaData,
};
