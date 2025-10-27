import { PaymentStatus, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { prisma } from "../../utils/prisma";

const getDashboardMetaData = async (user: IJwtPayload) => {
  let metadata;

  switch (user.role) {
    case UserRole.ADMIN:
      metadata = await getAdminMetaData();
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

  const barChartData = await getBarChartData();
  const peiChartData = await getPieChartData();

  return {
    totalPatient,
    totalDoctor,
    totalAdmin,
    totalAppointment,
    totalPayment,
    totalRevenue,
    barChartData,
    peiChartData,
  };
};

const getBarChartData = async () => {
  const appointmentCountPerMonth = await prisma.$queryRaw`
  SELECT 
  DATE_TRUNC('month',"createdAt") AS month,
  CAST(COUNT(*) AS INTEGER) AS count
  FROM "appointments" 
  GROUP BY month
  ORDER BY month ASC`;

  return appointmentCountPerMonth;
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });
  const formatAppointmentStatusDistribution = appointmentStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: Number(_count.id),
    })
  );
  return formatAppointmentStatusDistribution;
};

export const metaServices = {
  getDashboardMetaData,
};
