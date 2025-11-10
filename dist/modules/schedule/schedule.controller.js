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
exports.scheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const schedule_service_1 = require("./schedule.service");
const pick_1 = require("../../utils/pick");
const createSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield schedule_service_1.scheduleService.createSchedule(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Schedule Created successfully",
        data: result,
    });
}));
const scheduleForDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const filters = (0, pick_1.pick)(req.query, ["startDateTime", "endDateTime"]);
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield schedule_service_1.scheduleService.scheduleForDoctor(filters, options, user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Schedule For Doctor Retrieve successfully",
        data: {
            meta: result.meta,
            data: result.result,
        },
    });
}));
const deleteSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield schedule_service_1.scheduleService.deleteSchedule(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully",
        data: result,
    });
}));
exports.scheduleController = {
    createSchedule,
    scheduleForDoctor,
    deleteSchedule,
};
