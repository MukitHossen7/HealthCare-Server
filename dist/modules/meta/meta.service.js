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
exports.metaServices = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../utils/prisma");
const getDashboardMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let metadata;
    switch (user.role) {
        case client_1.UserRole.ADMIN:
            metadata = yield getAdminMetaData();
            break;
        case client_1.UserRole.DOCTOR:
            metadata = yield getDoctorMetaData(user);
            break;
        case client_1.UserRole.PATIENT:
            metadata = yield getPatientMetaData(user);
            break;
        default:
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid user role");
    }
    return metadata;
});
const getDoctorMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    const appointmentCount = yield prisma_1.prisma.appointment.count({
        where: {
            doctorId: doctorData.id,
        },
    });
    const patientCount = yield prisma_1.prisma.appointment.groupBy({
        by: ["patientId"],
        _count: {
            id: true,
        },
    });
    const reviewCount = yield prisma_1.prisma.review.count({
        where: {
            doctorId: doctorData.id,
        },
    });
    const totalRevenue = yield prisma_1.prisma.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            appointment: {
                doctorId: doctorData.id,
            },
            status: client_1.PaymentStatus.PAID,
        },
    });
    const appointmentStatusDistribution = yield prisma_1.prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: {
            doctorId: doctorData.id,
        },
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id),
    }));
    return {
        appointmentCount,
        reviewCount,
        patientCount: patientCount.length,
        totalRevenue,
        formattedAppointmentStatusDistribution,
    };
});
const getPatientMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    const appointmentCount = yield prisma_1.prisma.appointment.count({
        where: {
            patientId: patientData.id,
        },
    });
    const prescriptionCount = yield prisma_1.prisma.prescription.count({
        where: {
            patientId: patientData.id,
        },
    });
    const reviewCount = yield prisma_1.prisma.review.count({
        where: {
            patientId: patientData.id,
        },
    });
    const appointmentStatusDistribution = yield prisma_1.prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: {
            patientId: patientData.id,
        },
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id),
    }));
    return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formattedAppointmentStatusDistribution,
    };
});
const getAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPatient = yield prisma_1.prisma.patient.count();
    const totalDoctor = yield prisma_1.prisma.doctor.count();
    const totalAdmin = yield prisma_1.prisma.admin.count();
    const totalAppointment = yield prisma_1.prisma.appointment.count();
    const totalPayment = yield prisma_1.prisma.payment.count();
    const totalRevenue = yield prisma_1.prisma.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            status: client_1.PaymentStatus.PAID,
        },
    });
    const barChartData = yield getBarChartData();
    const peiChartData = yield getPieChartData();
    return {
        totalPatient,
        totalDoctor,
        totalAdmin,
        totalAppointment,
        totalPayment,
        totalRevenue,
        barChartData,
        peiChartData,
    };
});
const getBarChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentCountPerMonth = yield prisma_1.prisma.$queryRaw `
  SELECT 
  DATE_TRUNC('month',"createdAt") AS month,
  CAST(COUNT(*) AS INTEGER) AS count
  FROM "appointments" 
  GROUP BY month
  ORDER BY month ASC`;
    return appointmentCountPerMonth;
});
const getPieChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentStatusDistribution = yield prisma_1.prisma.appointment.groupBy({
        by: ["status"],
        _count: {
            id: true,
        },
    });
    const formatAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id),
    }));
    return formatAppointmentStatusDistribution;
});
exports.metaServices = {
    getDashboardMetaData,
};
