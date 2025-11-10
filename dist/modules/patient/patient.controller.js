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
exports.patientController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = require("../../utils/pick");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const patient_service_1 = require("./patient.service");
const getAllPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.pick)(req.query, ["search", "gender"]);
    const result = yield patient_service_1.patientServices.getAllPatient(options, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All Patient Retrieve successfully",
        data: {
            meta: result.meta,
            data: result.data,
        },
    });
}));
const getPatientById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield patient_service_1.patientServices.getPatientById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Get Single Patient Retrieve successfully",
        data: result,
    });
}));
const updatePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patientId = req.params.id;
    const user = req.user;
    const result = yield patient_service_1.patientServices.updatePatient(patientId, req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Patient update successfully",
        data: result,
    });
}));
const deletePatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield patient_service_1.patientServices.deletePatient(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Patient deleted successfully",
        data: result,
    });
}));
exports.patientController = {
    getAllPatient,
    getPatientById,
    updatePatient,
    deletePatient,
};
