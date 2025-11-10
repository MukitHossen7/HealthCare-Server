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
exports.doctorScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const doctorSchedule_service_1 = require("./doctorSchedule.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pick_1 = require("../../utils/pick");
const http_status_1 = __importDefault(require("http-status"));
const createDoctorSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield doctorSchedule_service_1.doctorScheduleService.createDoctorSchedule(req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Schedule Created successfully",
        data: result,
    });
}));
const getMyDoctorSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const filters = (0, pick_1.pick)(req.query, ["startDate", "endDate", "isBooked"]);
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield doctorSchedule_service_1.doctorScheduleService.getMyDoctorSchedule(user, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctor Own Schedule retrieve successfully",
        data: {
            meta: result.meta,
            data: result.data,
        },
    });
}));
const getAllDoctorSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.pick)(req.query, ["search", "isBooked"]);
    const result = yield doctorSchedule_service_1.doctorScheduleService.getAllDoctorSchedule(options, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All Doctor Schedule retrieve successfully",
        data: {
            meta: result.meta,
            data: result.data,
        },
    });
}));
const deleteDoctorScheduleById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const result = yield doctorSchedule_service_1.doctorScheduleService.deleteDoctorScheduleById(user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result,
    });
}));
exports.doctorScheduleController = {
    createDoctorSchedule,
    getMyDoctorSchedule,
    getAllDoctorSchedule,
    deleteDoctorScheduleById,
};
