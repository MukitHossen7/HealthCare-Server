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
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleService = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = require("../../utils/prisma");
const pagenationHelpers_1 = require("../../utils/pagenationHelpers");
const createSchedule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, startTime, endTime } = payload;
    const intervalTime = 30;
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const schedules = [];
    while (currentDate <= lastDate) {
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(startTime.split(":")[0])), Number(startTime.split(":")[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(endTime.split(":")[0])), Number(endTime.split(":")[1])));
        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime;
            const slotEndDateTime = (0, date_fns_1.addMinutes)(startDateTime, intervalTime);
            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime,
            };
            const existingSchedule = yield prisma_1.prisma.schedule.findFirst({
                where: scheduleData,
            });
            if (!existingSchedule) {
                const createdSchedule = yield prisma_1.prisma.schedule.create({
                    data: scheduleData,
                });
                schedules.push(createdSchedule);
            }
            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedules;
});
const scheduleForDoctor = (filters, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const { startDateTime, endDateTime } = filters;
    console.log(user);
    const whereCondition = {
        AND: [
            {
                startDateTime: {
                    gte: startDateTime,
                },
            },
            {
                endDateTime: {
                    lte: endDateTime,
                },
            },
        ],
    };
    const doctorSchedules = yield prisma_1.prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email,
            },
        },
        select: {
            scheduleId: true,
        },
    });
    const doctorSchedulesId = doctorSchedules.map((schedule) => schedule.scheduleId);
    const result = yield prisma_1.prisma.schedule.findMany({
        skip: skip,
        take: limit,
        where: Object.assign(Object.assign({}, whereCondition), { id: {
                notIn: doctorSchedulesId,
            } }),
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalData = yield prisma_1.prisma.schedule.count({
        where: Object.assign(Object.assign({}, whereCondition), { id: {
                notIn: doctorSchedulesId,
            } }),
    });
    return {
        meta: {
            page,
            limit,
            total: totalData,
        },
        result,
    };
});
const deleteSchedule = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.schedule.delete({
        where: {
            id: id,
        },
    });
    return result;
});
exports.scheduleService = {
    createSchedule,
    scheduleForDoctor,
    deleteSchedule,
};
