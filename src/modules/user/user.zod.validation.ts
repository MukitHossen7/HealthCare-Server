import z from "zod";

const createPatientZodSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email(),
    contactNumber: z.string({
      error: "Contact number is required",
    }),
    address: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]),
    profilePhoto: z.string().optional(),
  }),
});

export const userZodValidation = {
  createPatientZodSchema,
};
