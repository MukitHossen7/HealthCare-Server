import config from "../../config";
import { prisma } from "../../utils/prisma";
import { ICreatePatientInput } from "./user.interface";
import bcrypt from "bcryptjs";

const createPatient = async (payload: ICreatePatientInput) => {
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPTSALTROUND)
  );
  const createData = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
      },
    });

    const patientData = await tnx.patient.create({
      data: {
        name: payload.name,
        email: payload.email,
        contactNumber: payload.contactNumber,
        gender: payload.gender,
      },
    });

    return patientData;
  });

  return createData;
};

export const userServices = {
  createPatient,
};
