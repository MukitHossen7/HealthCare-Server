export interface ICreatePatientInput {
  email: string;
  password: string;
  name: string;
  contactNumber: string;
  gender: "MALE" | "FEMALE";
}
