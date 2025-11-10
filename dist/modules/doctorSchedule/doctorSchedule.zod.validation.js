"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorScheduleZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDoctorScheduleZodSchema = zod_1.default.object({
    scheduleIds: zod_1.default.array(zod_1.default.string().uuid({ message: "Invalid schedule ID format" })),
});
