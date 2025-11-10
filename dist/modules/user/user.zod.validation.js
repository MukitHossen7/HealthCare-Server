"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userZodValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createPatientZodSchema = zod_1.default.object({
    password: zod_1.default.string({
        error: "Password is required",
    }),
    patient: zod_1.default.object({
        name: zod_1.default.string({
            error: "Name is required",
        }),
        email: zod_1.default.email(),
        contactNumber: zod_1.default
            .string({
            error: "Contact number is required",
        })
            .optional(),
        address: zod_1.default.string().optional(),
        gender: zod_1.default.enum(["MALE", "FEMALE"]),
        profilePhoto: zod_1.default.string().optional(),
    }),
});
const createDoctorZodSchema = zod_1.default.object({
    password: zod_1.default.string({
        error: "Password is required",
    }),
    name: zod_1.default.string({
        error: "Name is required",
    }),
    email: zod_1.default.email(),
    contactNumber: zod_1.default.string({
        error: "Contact number is required",
    }),
    address: zod_1.default.string({
        error: "Address is required",
    }),
    registrationNumber: zod_1.default.string({
        error: "Registration number is required",
    }),
    experience: zod_1.default
        .number({
        error: "Experience is required",
    })
        .int()
        .nonnegative()
        .default(0),
    gender: zod_1.default.enum(["MALE", "FEMALE"], {
        error: "Gender  is required",
    }),
    appointmentFee: zod_1.default
        .number({
        error: "Appointment fee is required",
    })
        .int()
        .nonnegative(),
    qualification: zod_1.default.string({
        error: "Qualification is required",
    }),
    currentWorkingPlace: zod_1.default.string({
        error: "Current working place is required",
    }),
    designation: zod_1.default.string({
        error: "Designation is required",
    }),
});
const createAdminZodSchema = zod_1.default.object({
    password: zod_1.default.string({
        error: "Password is required",
    }),
    name: zod_1.default.string({
        error: "Name is required",
    }),
    email: zod_1.default.email(),
    contactNumber: zod_1.default.string({
        error: "Contact number is required",
    }),
});
const updateProfileZodSchema = zod_1.default.object({
    name: zod_1.default.string().optional(),
    contactNumber: zod_1.default.string().optional(),
    address: zod_1.default.string().optional(),
    gender: zod_1.default.enum(["MALE", "FEMALE"]).optional(),
    profilePhoto: zod_1.default.string().optional(),
    registrationNumber: zod_1.default.string().optional(),
    experience: zod_1.default.number().int().nonnegative().optional(),
    appointmentFee: zod_1.default.number().int().nonnegative().optional(),
    qualification: zod_1.default.string().optional(),
    currentWorkingPlace: zod_1.default.string().optional(),
    designation: zod_1.default.string().optional(),
});
exports.userZodValidation = {
    createPatientZodSchema,
    createDoctorZodSchema,
    createAdminZodSchema,
    updateProfileZodSchema,
};
