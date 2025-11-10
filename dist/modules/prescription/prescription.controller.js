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
exports.prescriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const prescription_service_1 = require("./prescription.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pick_1 = require("../../utils/pick");
const createPrescription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const payload = req.body;
    const result = yield prescription_service_1.prescriptionServices.createPrescription(user, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Create Prescription successfully",
        data: result,
    });
}));
const patientPrescription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield prescription_service_1.prescriptionServices.patientPrescription(user, options);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Patient Prescription Retrieve Successfully",
        data: {
            meta: result.meta,
            data: result.data,
        },
    });
}));
exports.prescriptionController = {
    createPrescription,
    patientPrescription,
};
