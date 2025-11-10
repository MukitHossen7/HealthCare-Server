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
exports.doctorScheduleService = void 0;
const client_1 = require("@prisma/client");
const pagenationHelpers_1 = require("../../utils/pagenationHelpers");
const prisma_1 = require("../../utils/prisma");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createDoctorSchedule = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId: scheduleId,
    }));
    const result = yield prisma_1.prisma.doctorSchedules.createMany({
        data: doctorScheduleData,
    });
    return result;
});
const getMyDoctorSchedule = (user, filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const { startDate, endDate } = filters, filterData = __rest(filters, ["startDate", "endDate"]);
    const andConditions = [];
    if (user.role === client_1.UserRole.DOCTOR && user.email) {
        andConditions.push({
            doctor: {
                email: user.email,
            },
        });
    }
    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate,
                        },
                    },
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate,
                        },
                    },
                },
            ],
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => {
                if (value === "true")
                    value = true;
                else if (value === "false")
                    value = false;
                return {
                    [field]: {
                        equals: value,
                    },
                };
            }),
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.prisma.doctorSchedules.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        include: {
            schedule: true,
            doctor: true,
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalData = yield prisma_1.prisma.doctorSchedules.count({
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
const getAllDoctorSchedule = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const { search } = filters, filterData = __rest(filters, ["search"]);
    const andConditions = [];
    if (search) {
        andConditions.push({
            doctor: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => {
                if (value === "true")
                    value = true;
                else if (value === "false")
                    value = false;
                return {
                    [field]: {
                        equals: value,
                    },
                };
            }),
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.prisma.doctorSchedules.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            doctor: true,
            schedule: true,
        },
    });
    const totalData = yield prisma_1.prisma.doctorSchedules.count({
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
const deleteDoctorScheduleById = (user, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isBookedSchedule = yield prisma_1.prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: scheduleId,
            isBooked: true,
        },
    });
    if (isBookedSchedule) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can not delete the schedule because of the schedule is already booked!");
    }
    const result = yield prisma_1.prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleId,
            },
        },
    });
    return result;
});
exports.doctorScheduleService = {
    createDoctorSchedule,
    getMyDoctorSchedule,
    getAllDoctorSchedule,
    deleteDoctorScheduleById,
};
