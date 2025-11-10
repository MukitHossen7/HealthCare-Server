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
exports.authServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../utils/prisma");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userToken_1 = require("../../utils/userToken");
const http_status_1 = __importDefault(require("http-status"));
const jwt_1 = require("../../utils/jwt");
const config_1 = __importDefault(require("../../config"));
const getMe = (userSession) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const accessToken = userSession.accessToken;
    if (!accessToken) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Access token is missing");
    }
    const decodedData = (0, jwt_1.verifyToken)(accessToken, config_1.default.JWT.ACCESS_TOKEN_SECRET);
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            doctor: {
                select: {
                    name: true,
                    profilePhoto: true,
                },
            },
            patient: {
                select: {
                    name: true,
                    profilePhoto: true,
                },
            },
            admin: {
                select: {
                    name: true,
                    profilePhoto: true,
                },
            },
        },
    });
    const { id, email, role, needPasswordChange, status } = userData;
    let name = null;
    let profilePhoto = null;
    if (role === client_1.UserRole.DOCTOR) {
        name = (_a = userData.doctor) === null || _a === void 0 ? void 0 : _a.name;
        profilePhoto = (_b = userData.doctor) === null || _b === void 0 ? void 0 : _b.profilePhoto;
    }
    else if (role === client_1.UserRole.PATIENT) {
        name = (_c = userData.patient) === null || _c === void 0 ? void 0 : _c.name;
        profilePhoto = (_d = userData.patient) === null || _d === void 0 ? void 0 : _d.profilePhoto;
    }
    else if (role === client_1.UserRole.ADMIN) {
        name = (_e = userData.admin) === null || _e === void 0 ? void 0 : _e.name;
        profilePhoto = (_f = userData.admin) === null || _f === void 0 ? void 0 : _f.profilePhoto;
    }
    return {
        id,
        email,
        role,
        needPasswordChange,
        status,
        name,
        profilePhoto,
    };
});
const createLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.status !== client_1.UserStatus.ACTIVE) {
        throw new AppError_1.default(403, "User is not active");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(410, "User has been deleted");
    }
    // if (!user.isVerified) {
    //   throw new AppError(401, "User email is not verified");
    // }
    const isCorrectPassword = yield bcryptjs_1.default.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(401, "Incorrect password");
    }
    const tokenPayload = {
        email: user.email,
        role: user.role,
        id: user.id,
    };
    const userTokens = (0, userToken_1.createUserTokens)(tokenPayload);
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        needPasswordChange: user.needPasswordChange,
    };
});
const createNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userToken_1.createNewAccessTokenUseRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken.accessToken,
    };
});
exports.authServices = {
    getMe,
    createLogin,
    createNewAccessToken,
};
