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
exports.doctorController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const doctor_service_1 = require("./doctor.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pick_1 = require("../../utils/pick");
const getAllDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.pick)(req.query, [
        "search",
        "contactNumber",
        "experience",
        "gender",
        "appointmentFee",
        "specialties",
    ]);
    const result = yield doctor_service_1.doctorServices.getAllDoctors(options, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctors Retrieve successfully",
        data: {
            meta: result.meta,
            data: result.data,
        },
    });
}));
const getAISuggestions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.doctorServices.getAISuggestions(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "AI suggestions fetched successfully",
        data: result.recommendedDoctors,
    });
}));
const updateDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield doctor_service_1.doctorServices.updateDoctors(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctors Retrieve successfully",
        data: result,
    });
}));
const deleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield doctor_service_1.doctorServices.deleteDoctor(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctors deleted successfully",
        data: result,
    });
}));
const getDoctorById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield doctor_service_1.doctorServices.getDoctorById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctors retrieve By Id successfully",
        data: result,
    });
}));
exports.doctorController = {
    getAllDoctors,
    getAISuggestions,
    updateDoctors,
    deleteDoctor,
    getDoctorById,
};
