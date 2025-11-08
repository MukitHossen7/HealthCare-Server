import z from "zod";

const createPatientZodSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  patient: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email(),
    contactNumber: z
      .string({
        error: "Contact number is required",
      })
      .optional(),
    address: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]),
    profilePhoto: z.string().optional(),
  }),
});

const createDoctorZodSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  name: z.string({
    error: "Name is required",
  }),
  email: z.email(),
  contactNumber: z.string({
    error: "Contact number is required",
  }),
  address: z.string({
    error: "Address is required",
  }),
  registrationNumber: z.string({
    error: "Registration number is required",
  }),
  experience: z
    .number({
      error: "Experience is required",
    })
    .int()
    .nonnegative()
    .default(0),
  gender: z.enum(["MALE", "FEMALE"], {
    error: "Gender  is required",
  }),
  appointmentFee: z
    .number({
      error: "Appointment fee is required",
    })
    .int()
    .nonnegative(),
  qualification: z.string({
    error: "Qualification is required",
  }),
  currentWorkingPlace: z.string({
    error: "Current working place is required",
  }),
  designation: z.string({
    error: "Designation is required",
  }),
});

const createAdminZodSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  name: z.string({
    error: "Name is required",
  }),
  email: z.email(),
  contactNumber: z.string({
    error: "Contact number is required",
  }),
});

const updateProfileZodSchema = z.object({
  name: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  profilePhoto: z.string().optional(),
  registrationNumber: z.string().optional(),
  experience: z.number().int().nonnegative().optional(),
  appointmentFee: z.number().int().nonnegative().optional(),
  qualification: z.string().optional(),
  currentWorkingPlace: z.string().optional(),
  designation: z.string().optional(),
});

export const userZodValidation = {
  createPatientZodSchema,
  createDoctorZodSchema,
  createAdminZodSchema,
  updateProfileZodSchema,
};
