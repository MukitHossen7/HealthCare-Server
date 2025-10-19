import { fileUploader } from "../../utils/fileUploader";
import { prisma } from "../../utils/prisma";
import { ISpecialties } from "./specialties.interface";

const createSpecialties = async (
  payload: ISpecialties,
  file?: Express.Multer.File
) => {
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: {
      ...payload,
      icon: payload?.icon as string,
    },
  });

  return result;
};

const getAllSpecialties = async () => {
  return await prisma.specialties.findMany();
};

const deleteSpecialties = async (id: string) => {
  const result = await prisma.specialties.delete({
    where: {
      id: id,
    },
  });

  return result;
};

export const specialtiesServices = {
  createSpecialties,
  getAllSpecialties,
  deleteSpecialties,
};
