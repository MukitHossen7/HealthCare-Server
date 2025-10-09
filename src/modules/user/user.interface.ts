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
