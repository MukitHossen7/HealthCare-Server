import { Gender } from "@prisma/client";

export interface IDoctorUpdateInput {
  id?: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  specialties: {
    specialtyId: string;
    isDeleted?: boolean;
  }[];
}
