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
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pick_1 = require("../../utils/pick");
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, ["search", "role", "status"]);
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    // const limit = Number(req.query.limit) || 10;
    // const page = Number(req.query.page) || 1;
    // const search = req.query.search as string | undefined;
    // const sortBy = (req.query.sortBy || "createdAt") as string;
    // const sortOrder = (req.query.sortOrder || "desc") as string;
    // const role = req.query.role;
    // const status = req.query.status;
    const result = yield user_service_1.userServices.getAllUsers(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All Users retrieved successfully",
        data: {
            meta: result.meta,
            data: result.users,
        },
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.userServices.getMyProfile(user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Retrieve my profile data successfully",
        data: result,
    });
}));
const createPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const file = req.file;
    const result = yield user_service_1.userServices.createPatient(payload, file);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Patient Created successfully",
        data: result,
    });
}));
const createDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const file = req.file;
    const result = yield user_service_1.userServices.createDoctor(payload, file);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created successfully",
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const file = req.file;
    const result = yield user_service_1.userServices.createAdmin(payload, file);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfully",
        data: result,
    });
}));
const changeProfileStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userServices.changeProfileStatus(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Update user status successfully",
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const file = req.file;
    const payload = req.body;
    const result = yield user_service_1.userServices.updateMyProfile(user, payload, file);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My profile updated!",
        data: result,
    });
}));
exports.userController = {
    getAllUsers,
    getMyProfile,
    createPatient,
    createDoctor,
    createAdmin,
    changeProfileStatus,
    updateMyProfile,
};
