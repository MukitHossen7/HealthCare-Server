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
exports.patientServices = void 0;
const pagenationHelpers_1 = require("../../utils/pagenationHelpers");
const prisma_1 = require("../../utils/prisma");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const getAllPatient = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const searchFields = ["name", "email"];
    const { search } = filters, filterData = __rest(filters, ["search"]);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: searchFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => ({
                [field]: {
                    equals: value,
                },
            })),
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.prisma.patient.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalData = yield prisma_1.prisma.patient.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit: limit,
            total: totalData,
        },
        data: result,
    };
});
const getPatientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    return result;
});
const deletePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    const result = yield prisma_1.prisma.user.update({
        where: {
            email: patientData.email,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
const updatePatient = (patientId, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientHealthData, medicalReport } = payload, patientInfo = __rest(payload, ["patientHealthData", "medicalReport"]);
    const patientData = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    if (patientId !== patientData.id) {
        throw new AppError_1.default(403, "You are not authorized to update this patient information");
    }
    const result = yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tnx.patient.update({
            where: {
                id: patientData.id,
            },
            data: patientInfo,
        });
        if (patientHealthData) {
            yield tnx.patientHealthData.upsert({
                where: {
                    patientId: patientData.id,
                },
                update: patientHealthData,
                create: Object.assign(Object.assign({}, patientHealthData), { patientId: patientData.id }),
            });
        }
        if (medicalReport) {
            yield tnx.medicalReport.create({
                data: Object.assign(Object.assign({}, medicalReport), { patientId: patientData.id }),
            });
        }
        const updateData = yield tnx.patient.findUnique({
            where: {
                id: patientData.id,
            },
            include: {
                patientHealthData: true,
                medicalReports: true,
            },
        });
        return updateData;
    }));
    return result;
});
exports.patientServices = {
    getAllPatient,
    getPatientById,
    updatePatient,
    deletePatient,
};
