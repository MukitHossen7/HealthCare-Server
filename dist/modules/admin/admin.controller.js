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
exports.adminController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = require("../../utils/pick");
const admin_service_1 = require("./admin.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const getAllAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.pick)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.pick)(req.query, ["search", "contactNumber", "name"]);
    const result = yield admin_service_1.adminServices.getAllAdmin(options, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All Admin Retrieve successfully",
        data: {
            meta: result.meta,
            data: result.data,
        },
    });
}));
const getAdminById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield admin_service_1.adminServices.getAdminById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Get Single Admin Retrieve successfully",
        data: result,
    });
}));
const updateAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield admin_service_1.adminServices.updateAdmin(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin update successfully",
        data: result,
    });
}));
const deleteAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield admin_service_1.adminServices.deleteAdmin(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
}));
exports.adminController = {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
