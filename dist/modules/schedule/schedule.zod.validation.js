"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScheduleZodSchema = void 0;
const zod_1 = require("zod");
exports.createScheduleZodSchema = zod_1.z.object({
    startDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid startDate format (expected YYYY-MM-DD)"),
    endDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid endDate format (expected YYYY-MM-DD)"),
    startTime: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid startTime format (expected HH:MM)"),
    endTime: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid endTime format (expected HH:MM)"),
});
