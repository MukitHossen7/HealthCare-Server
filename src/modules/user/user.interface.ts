export interface ICreatePatientInput {
  password: string;
  patient: {
    email: string;
    name: string;
    contactNumber: string;
    gender: "MALE" | "FEMALE";
    profilePhoto?: string;
  };
}

export interface ICreateDoctorInput {
  password: string;
  name: string;
  email: string;
  contactNumber: string;
  profilePhoto?: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE";
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
}

export interface ICreateAdminInput {
  password: string;
  name: string;
  email: string;
  contactNumber: string;
  profilePhoto?: string;
}

export interface IUpdateProfile {
  name?: string;
  contactNumber?: string;
  profilePhoto?: string;
  address?: string;
  registrationNumber?: string;
  experience?: number;
  gender?: "MALE" | "FEMALE";
  appointmentFee?: number;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
}
