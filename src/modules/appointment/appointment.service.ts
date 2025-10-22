import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import { prisma } from "../../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../../config/stripe.config";
import config from "../../config";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";

const createAppointment = async (
  payload: Partial<Appointment>,
  user: IJwtPayload
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      user: {
        isDeleted: false,
      },
    },
  });

  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId as string,
        videoCallingId: videoCallingId,
      },
    });

    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId as string,
        },
      },
      data: {
        isBooked: true,
      },
    });
    const transactionId = uuidv4();

    const paymentData = await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId: transactionId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patientData.email,

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with  ${doctorData.name}`,
            },
            unit_amount: doctorData.appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id,
      },
      success_url: `${config.STRIPE.success_url}`,
      cancel_url: `${config.STRIPE.cancel_url}`,
    });
    return {
      paymentUrl: session.url,
      appointmentData,
    };
  });
  return result;
};

const getMyAppointment = async (
  options: TOptions,
  filters: any,
  user: IJwtPayload
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { ...filterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user.email,
      },
    });
  }

  if (user.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include:
      user.role === UserRole.DOCTOR ? { patient: true } : { doctor: true },
  });

  const totalData = await prisma.appointment.count({
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

const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  user: IJwtPayload
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
      paymentStatus: PaymentStatus.PAID,
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

  const updateAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: status,
    },
  });

  return updateAppointment;
};
export const appointmentServices = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
};
