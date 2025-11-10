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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../config"));
const fileUploader_1 = require("../../utils/fileUploader");
const pagenationHelpers_1 = require("../../utils/pagenationHelpers");
const prisma_1 = require("../../utils/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getAllUsers = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, pagenationHelpers_1.calculatePagination)(options);
    const { search } = filters, filterData = __rest(filters, ["search"]);
    const whereCondition = {
        email: search ? { contains: search, mode: "insensitive" } : undefined,
        role: filterData.role,
        status: filterData.status,
    };
    const users = yield prisma_1.prisma.user.findMany({
        skip: skip,
        take: limit,
        where: whereCondition,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalData = yield prisma_1.prisma.user.count({
        where: whereCondition,
    });
    return {
        meta: {
            page: page,
            limit: limit,
            total: totalData,
        },
        users,
    };
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true,
            isDeleted: true,
            isVerified: true,
        },
    });
    let profileData;
    //patient
    if (userData.role === client_1.UserRole.PATIENT) {
        profileData = yield prisma_1.prisma.patient.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    // doctor
    if (userData.role === client_1.UserRole.DOCTOR) {
        profileData = yield prisma_1.prisma.doctor.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    //admin
    if (userData.role === client_1.UserRole.ADMIN) {
        profileData = yield prisma_1.prisma.admin.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    return Object.assign(Object.assign({}, userData), profileData);
});
const createPatient = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const upload = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.patient.profilePhoto = upload === null || upload === void 0 ? void 0 : upload.secure_url;
    }
    const hashPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.BCRYPTSALTROUND));
    const createData = yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tnx.user.create({
            data: {
                email: payload.patient.email,
                password: hashPassword,
            },
        });
        const patientData = yield tnx.patient.create({
            data: {
                name: payload.patient.name,
                email: payload.patient.email,
                address: payload.patient.address,
                gender: payload.patient.gender,
                profilePhoto: payload.patient.profilePhoto,
            },
        });
        return patientData;
    }));
    return createData;
});
const createDoctor = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const upload = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.profilePhoto = upload === null || upload === void 0 ? void 0 : upload.secure_url;
    }
    const hashPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.BCRYPTSALTROUND));
    const createData = yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword,
                role: "DOCTOR",
            },
        });
        const doctorData = yield tnx.doctor.create({
            data: {
                name: payload.name,
                email: payload.email,
                contactNumber: payload.contactNumber,
                gender: payload.gender,
                profilePhoto: payload.profilePhoto,
                address: payload.address,
                registrationNumber: payload.registrationNumber,
                experience: payload.experience,
                appointmentFee: payload.appointmentFee,
                qualification: payload.qualification,
                currentWorkingPlace: payload.currentWorkingPlace,
                designation: payload.designation,
            },
        });
        return doctorData;
    }));
    return createData;
});
const createAdmin = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const upload = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.profilePhoto = upload === null || upload === void 0 ? void 0 : upload.secure_url;
    }
    const hashPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.BCRYPTSALTROUND));
    const createData = yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword,
                role: "ADMIN",
                isVerified: true,
            },
        });
        const adminData = yield tnx.admin.create({
            data: {
                name: payload.name,
                email: payload.email,
                contactNumber: payload.contactNumber,
                profilePhoto: payload.profilePhoto,
            },
        });
        return adminData;
    }));
    return createData;
});
const changeProfileStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    const updateStatus = yield prisma_1.prisma.user.update({
        where: {
            id: userData.id,
        },
        data: {
            status: payload.status,
        },
    });
    return updateStatus;
});
const updateMyProfile = (user, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    let imageUrl;
    if (file) {
        const upload = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        imageUrl = upload === null || upload === void 0 ? void 0 : upload.secure_url;
    }
    let profileInfo;
    if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.prisma.admin.update({
            where: {
                email: userInfo.email,
            },
            data: Object.assign(Object.assign({}, payload), (imageUrl && { profilePhoto: imageUrl })),
        });
    }
    else if (userInfo.role === client_1.UserRole.PATIENT) {
        profileInfo = yield prisma_1.prisma.patient.update({
            where: {
                email: userInfo.email,
            },
            data: Object.assign(Object.assign({}, payload), (imageUrl && { profilePhoto: imageUrl })),
        });
    }
    else if (userInfo.role === client_1.UserRole.DOCTOR) {
        profileInfo = yield prisma_1.prisma.doctor.update({
            where: {
                email: userInfo.email,
            },
            data: Object.assign(Object.assign({}, payload), (imageUrl && { profilePhoto: imageUrl })),
        });
    }
    return Object.assign({}, profileInfo);
});
exports.userServices = {
    getMyProfile,
    createPatient,
    createDoctor,
    createAdmin,
    getAllUsers,
    changeProfileStatus,
    updateMyProfile,
};
