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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
const prisma_1 = require("../../utils/prisma");
const client_1 = require("@prisma/client");
const handleStripeWebhookEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const appointmentId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.appointmentId;
            const paymentId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.paymentId;
            yield prisma_1.prisma.appointment.update({
                where: {
                    id: appointmentId,
                },
                data: {
                    paymentStatus: session.payment_status === "paid"
                        ? client_1.PaymentStatus.PAID
                        : client_1.PaymentStatus.UNPAID,
                },
            });
            yield prisma_1.prisma.payment.update({
                where: {
                    id: paymentId,
                },
                data: {
                    status: session.payment_status === "paid"
                        ? client_1.PaymentStatus.PAID
                        : client_1.PaymentStatus.UNPAID,
                    paymentGatewayData: session,
                },
            });
            break;
        }
        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
});
exports.paymentServices = {
    handleStripeWebhookEvent,
};
