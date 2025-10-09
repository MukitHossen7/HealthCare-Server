import config from "../../config";
import { fileUploader } from "../../utils/fileUploader";
import { prisma } from "../../utils/prisma";
import { ICreatePatientInput } from "./user.interface";
import bcrypt from "bcryptjs";

const createPatient = async (
  payload: ICreatePatientInput,
  file?: Express.Multer.File
) => {
  if (file) {
    const upload = await fileUploader.uploadToCloudinary(file);
    payload.patient.profilePhoto = upload?.secure_url;
  }
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPTSALTROUND)
  );

  const createData = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.patient.email,
        password: hashPassword,
      },
    });

    const patientData = await tnx.patient.create({
      data: {
        name: payload.patient.name,
        email: payload.patient.email,
        contactNumber: payload.patient.contactNumber,
        gender: payload.patient.gender,
        profilePhoto: payload.patient.profilePhoto,
      },
    });

    return patientData;
  });

  return createData;
};

export const userServices = {
  createPatient,
};
