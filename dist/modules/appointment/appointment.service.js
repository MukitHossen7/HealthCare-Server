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
exports.appointmentServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../utils/prisma");
const uuid_1 = require("uuid");
const stripe_config_1 = require("../../config/stripe.config");
const config_1 = __importDefault(require("../../config"));
const pagenationHelpers_1 = require("../../utils/pagenationHelpers");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createAppointment = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            user: {
                isDeleted: false,
            },
        },
    });
    yield prisma_1.prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false,
        },
    });
    const videoCallingId = (0, uuid_1.v4)();
    const result = yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        const appointmentData = yield tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId: videoCallingId,
            },
        });
        yield tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId,
                },
            },
            data: {
                isBooked: true,
            },
        });
        const transactionId = (0, uuid_1.v4)();
        const paymentData = yield tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId: transactionId,
            },
        });
        const session = yield stripe_config_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: patientData.email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Appointment with  ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id,
            },
            success_url: `${config_1.default.STRIPE.success_url}`,
            cancel_url: `${config_1.default.STRIPE.cancel_url}`,
        });
        return {
            paymentUrl: session.url,
            appointmentData,
        };
    }));
    return result;
});
const getAllAppointments = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const { patientEmail, doctorEmail } = filters, filterData = __rest(filters, ["patientEmail", "doctorEmail"]);
    const andConditions = [];
    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail,
            },
        });
    }
    else if (doctorEmail) {
        andConditions.push({
            doctor: {
                email: doctorEmail,
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => ({
                [field]: {
                    equals: value,
                },
            })),
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.prisma.appointment.findMany({
        where: whereCondition,
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
    const totalData = yield prisma_1.prisma.appointment.count({
        where: whereCondition,
    });
    return {
        meta: {
            page: page,
            limit: limit,
            total: totalData,
        },
        data: result,
    };
});
const getMyAppointment = (options, filters, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const filterData = __rest(filters, []);
    const andConditions = [];
    if (user.role === client_1.UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user.email,
            },
        });
    }
    if (user.role === client_1.UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user.email,
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => ({
                [field]: {
                    equals: value,
                },
            })),
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.prisma.appointment.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: user.role === client_1.UserRole.DOCTOR ? { patient: true } : { doctor: true },
    });
    const totalData = yield prisma_1.prisma.appointment.count({
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
const updateAppointmentStatus = (appointmentId, status, user) => __awaiter(void 0, void 0, void 0, function* () {
    const appointmentData = yield prisma_1.prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId,
            paymentStatus: client_1.PaymentStatus.PAID,
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
    const updateAppointment = yield prisma_1.prisma.appointment.update({
        where: {
            id: appointmentId,
        },
        data: {
            status: status,
        },
    });
    return updateAppointment;
});
const cancelUnpaidAppointment = () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    const unpaidAppointments = yield prisma_1.prisma.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo,
            },
            paymentStatus: client_1.PaymentStatus.UNPAID,
        },
    });
    const appointmentIdsToCancel = unpaidAppointments.map((appointment) => appointment.id);
    yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        //delete payment
        yield tnx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentIdsToCancel,
                },
            },
        });
        //delete appointment
        yield tnx.appointment.deleteMany({
            where: {
                id: {
                    in: appointmentIdsToCancel,
                },
            },
        });
        //update doctorSchedules
        for (const unpaidAppointment of unpaidAppointments) {
            yield tnx.doctorSchedules.update({
                where: {
                    doctorId_scheduleId: {
                        doctorId: unpaidAppointment.doctorId,
                        scheduleId: unpaidAppointment.scheduleId,
                    },
                },
                data: {
                    isBooked: false,
                },
            });
        }
    }));
});
exports.appointmentServices = {
    createAppointment,
    getMyAppointment,
    updateAppointmentStatus,
    getAllAppointments,
    cancelUnpaidAppointment,
};
