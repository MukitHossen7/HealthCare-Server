import { Prisma, Review } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import { prisma } from "../../utils/prisma";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";

const createReview = async (payload: Partial<Review>, user: IJwtPayload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (patientData.id !== appointmentData.patientId) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }

  return await prisma.$transaction(async (tnx) => {
    const review = await tnx.review.create({
      data: {
        patientId: patientData.id,
        doctorId: appointmentData.doctorId,
        appointmentId: appointmentData.id,
        rating: payload.rating as number,
        comment: payload.comment || null,
      },
    });

    const avgRating = await tnx.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: appointmentData.doctorId,
      },
    });

    await tnx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRating: avgRating._avg.rating as number,
      },
    });

    return review;
  });
};

const getAllReviews = async (options: TOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { patientEmail, doctorEmail } = filters;

  const andConditions: Prisma.ReviewWhereInput[] = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  }

  if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }

  const whereCondition: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      patient: true,
      doctor: true,
    },
  });
  const totalData = await prisma.review.count({
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

export const reviewServices = {
  createReview,
  getAllReviews,
};
