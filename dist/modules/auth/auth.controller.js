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
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const setCookie_1 = require("../../utils/setCookie");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userSession = req.cookies;
    const result = yield auth_service_1.authServices.getMe(userSession);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User get own profile data successfully",
        data: result,
    });
}));
const createLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield auth_service_1.authServices.createLogin(payload);
    const userTokens = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
    };
    (0, setCookie_1.setAuthCookie)(res, userTokens);
    const { needPasswordChange } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Your login is successfully",
        data: {
            needPasswordChange,
        },
    });
}));
const createNewAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    // console.log(refreshToken);
    if (!refreshToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token is missing");
    }
    const tokenInfo = yield auth_service_1.authServices.createNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo.accessToken,
    });
}));
exports.authController = {
    getMe,
    createLogin,
    createNewAccessToken,
};
