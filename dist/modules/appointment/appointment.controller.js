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
exports.appointmentController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appointment_service_1 = require("./appointment.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pick_1 = require("../../utils/pick");
const createAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield appointment_service_1.appointmentServices.createAppointment(req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Appointment Created successfully",
        data: result,
    });
}));
const getAllAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.pick)(req.query, [
        "patientEmail",
        "doctorEmail",
        "status",
        "paymentStatus",
    ]);
    const result = yield appointment_service_1.appointmentServices.getAllAppointments(options, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My Appointment Retrieve successfully",
        data: {
            meta: result.meta,
            data: result.data,
        },
    });
}));
const getMyAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.pick)(req.query, ["status", "paymentStatus"]);
    const user = req.user;
    const result = yield appointment_service_1.appointmentServices.getMyAppointment(options, filters, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My Appointment Retrieve successfully",
        data: {
            meta: result.meta,
            data: result.data,
        },
    });
}));
const updateAppointmentStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const status = req.body.status;
    const appointmentId = req.params.id;
    const result = yield appointment_service_1.appointmentServices.updateAppointmentStatus(appointmentId, status, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Appointment Update successfully",
        data: result,
    });
}));
exports.appointmentController = {
    createAppointment,
    getMyAppointment,
    updateAppointmentStatus,
    getAllAppointments,
};
