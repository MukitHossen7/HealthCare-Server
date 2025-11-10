"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorServices = void 0;
const pagenationHelpers_1 = require("../../utils/pagenationHelpers");
const prisma_1 = require("../../utils/prisma");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const openRouter_1 = require("../../utils/openRouter");
const getAllDoctors = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const searchFields = ["name", "email"];
    const { search, specialties } = filters, filterFields = __rest(filters, ["search", "specialties"]);
    const andConditions = [];
    if (search) {
        const searchResult = {
            OR: searchFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            })),
        };
        andConditions.push(searchResult);
    }
    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }
    if (Object.keys(filterFields).length) {
        const filterResult = {
            AND: Object.entries(filterFields).map(([field, value]) => {
                if (["experience", "appointmentFee"].includes(field)) {
                    value = Number(value);
                }
                return {
                    [field]: {
                        equals: value,
                    },
                };
            }),
        };
        andConditions.push(filterResult);
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.prisma.doctor.findMany({
        where: whereCondition,
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true,
                },
            },
            reviews: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.prisma.doctor.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAISuggestions = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!(payload && payload.symptom)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Symptom is required");
    }
    const doctors = yield prisma_1.prisma.doctor.findMany({
        where: {
            user: {
                isDeleted: false,
            },
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true,
                },
            },
        },
    });
    const prompt = `
You are a professional AI medical assistant. 

A patient reports the following symptom: "${payload.symptom}". 
Your task is to recommend the **top most relevant doctors** from the list provided below.

Follow these strict rules:
1. Only suggest doctors whose specialty **matches the symptom**.
2. Do NOT invent doctors or specialties.
3. Do NOT provide unnecessary explanations or unrelated text.
4. Return only **valid JSON** in this exact format:

{
  "recommendedDoctors": [
    {
      "id": "...",
      "name": "...",
      "email": "...",
      "profilePhoto": "...",
      "contactNumber": "...",
      "address": "...",
      "registrationNumber": "...",
      "experience": "...",
      "gender": "...",
      "appointmentFee": "...",
      "qualification": "...",
      "currentWorkingPlace": "...",
      "designation": "...",
      "specialties": [
        { "title": "Specialty Title 1", "icon": "Icon URL 1" },
        { "title": "Specialty Title 2", "icon": "Icon URL 2" }
      ],
      "reason": "One sentence why this doctor is recommended for this symptom"
    }
  ]
}

Doctor List (use only doctors from this list):
${JSON.stringify(doctors, null, 2)}
`;
    const completion = yield openRouter_1.openai.chat.completions.create({
        model: "z-ai/glm-4.5-air:free",
        messages: [
            {
                role: "system",
                content: "You are a helpful AI medical assistant that provides doctor suggestions",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });
    const aiMessage = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
    if (!aiMessage) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "AI did not return any message");
    }
    const cleanMessage = aiMessage.replace(/```json|```/g, "").trim();
    let aiResult;
    try {
        aiResult = JSON.parse(cleanMessage);
    }
    catch (err) {
        console.error("AI response is not valid JSON", err);
        aiResult = { message: aiMessage }; // fallback
    }
    return aiResult;
});
const getDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id: id,
            user: {
                isDeleted: false,
            },
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true,
                },
            },
            reviews: true,
        },
    });
    return doctorData;
});
const updateDoctors = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialties } = payload, doctorData = __rest(payload, ["specialties"]);
    const isDoctor = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    return yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);
            for (const specialty of deleteSpecialtyIds) {
                yield tx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: isDoctor.id,
                        specialtiesId: specialty.specialtyId,
                    },
                });
            }
            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);
            for (const specialty of createSpecialtyIds) {
                yield tx.doctorSpecialties.create({
                    data: {
                        doctorId: isDoctor.id,
                        specialtiesId: specialty.specialtyId,
                    },
                });
            }
        }
        const updateDoctor = yield tx.doctor.update({
            where: {
                id: id,
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialties: true,
                    },
                },
            },
        });
        return updateDoctor;
    }));
});
const deleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    const result = yield prisma_1.prisma.user.update({
        where: {
            email: doctorData.email,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.doctorServices = {
    getAllDoctors,
    updateDoctors,
    deleteDoctor,
    getDoctorById,
    getAISuggestions,
};
