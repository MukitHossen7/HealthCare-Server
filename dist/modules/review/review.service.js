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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewServices = void 0;
const prisma_1 = require("../../utils/prisma");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const pagenationHelpers_1 = require("../../utils/pagenationHelpers");
const createReview = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const appointmentData = yield prisma_1.prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
        },
    });
    if (patientData.id !== appointmentData.patientId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This is not your appointment");
    }
    return yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        const review = yield tnx.review.create({
            data: {
                patientId: patientData.id,
                doctorId: appointmentData.doctorId,
                appointmentId: appointmentData.id,
                rating: payload.rating,
                comment: payload.comment || null,
            },
        });
        const avgRating = yield tnx.review.aggregate({
            _avg: {
                rating: true,
            },
            where: {
                doctorId: appointmentData.doctorId,
            },
        });
        yield tnx.doctor.update({
            where: {
                id: appointmentData.doctorId,
            },
            data: {
                averageRating: avgRating._avg.rating,
            },
        });
        return review;
    }));
});
const getAllReviews = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const { patientEmail, doctorEmail } = filters;
    const andConditions = [];
    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail,
            },
        });
    }
    if (doctorEmail) {
        andConditions.push({
            doctor: {
                email: doctorEmail,
            },
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.prisma.review.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            patient: true,
            doctor: true,
        },
    });
    const totalData = yield prisma_1.prisma.review.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total: totalData,
        },
        data: result,
    };
});
exports.reviewServices = {
    createReview,
    getAllReviews,
};
