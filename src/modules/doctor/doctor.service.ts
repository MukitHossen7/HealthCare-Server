import { Prisma } from "@prisma/client";
import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";
import { prisma } from "../../utils/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";
import AppError from "../../errorHelpers/AppError";
import HttpStatus from "http-status";
import { openai } from "../../utils/openRouter";

const getAllDoctors = async (options: TOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const searchFields = ["name", "email"];
  const { search, specialties, ...filterFields } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (search) {
    const searchResult = {
      OR: searchFields.map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    };
    andConditions.push(searchResult);
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterFields).length) {
    const filterResult = {
      AND: Object.entries(filterFields).map(([field, value]) => {
        if (["experience", "appointmentFee"].includes(field)) {
          value = Number(value);
        }
        return {
          [field]: {
            equals: value,
          },
        };
      }),
    };
    andConditions.push(filterResult);
  }

  const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.doctor.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAISuggestions = async (payload: { symptom: string }) => {
  console.log(payload);
  if (!(payload && payload.symptom)) {
    throw new AppError(HttpStatus.BAD_REQUEST, "Symptom is required");
  }

  const doctors = await prisma.doctor.findMany({
    where: {
      user: {
        isDeleted: false,
      },
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const prompt = `
  You are a professional medical assistant AI.
  A patient reports the following symptom: "${payload.symptom}".
  Based on the list of doctors and their specialties below, suggest the top 3 most relevant doctors. 
  Symptoms: ${payload.symptom}
  Here is the doctor list (in JSON):
  ${JSON.stringify(doctors, null, 2)}
  Return response in this JSON format with full individual doctor data.
  `;

  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggestions",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // console.log(doctors);
};

const getDoctorById = async (id: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return doctorData;
};

const updateDoctors = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const { specialties, ...doctorData } = payload;
  const isDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  return await prisma.$transaction(async (tx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const specialty of deleteSpecialtyIds) {
        await tx.doctorSpecialties.deleteMany({
          where: {
            doctorId: isDoctor.id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }
      const createSpecialtyIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );

      for (const specialty of createSpecialtyIds) {
        await tx.doctorSpecialties.create({
          data: {
            doctorId: isDoctor.id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }
    }

    const updateDoctor = await tx.doctor.update({
      where: {
        id: id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });
    return updateDoctor;
  });
};

const deleteDoctor = async (id: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const result = await prisma.doctor.delete({
    where: {
      id: doctorData.id,
    },
  });

  return result;
};

export const doctorServices = {
  getAllDoctors,
  updateDoctors,
  deleteDoctor,
  getDoctorById,
  getAISuggestions,
};
