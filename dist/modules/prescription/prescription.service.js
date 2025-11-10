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
exports.prescriptionServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../utils/prisma");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const pagenationHelpers_1 = require("../../utils/pagenationHelpers");
const createPrescription = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentData = yield prisma_1.prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: client_1.AppointmentStatus.COMPLETED,
        },
        include: {
            doctor: true,
        },
    });
    if (user.role === client_1.UserRole.DOCTOR) {
        if (user.email !== appointmentData.doctor.email) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This is not you appointment");
        }
    }
    const result = yield prisma_1.prisma.prescription.create({
        data: {
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            appointmentId: appointmentData.id,
            instructions: payload.instructions,
            followUpDate: payload.followUpDate || null,
        },
    });
    return result;
});
const patientPrescription = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const prescriptionData = yield prisma_1.prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email,
            },
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            patient: true,
            doctor: true,
        },
    });
    const totalData = yield prisma_1.prisma.prescription.count({
        where: {
            patient: {
                email: user.email,
            },
        },
    });
    return {
        meta: {
            page,
            limit: limit,
            total: totalData,
        },
        data: prescriptionData,
    };
});
exports.prescriptionServices = {
    createPrescription,
    patientPrescription,
};
