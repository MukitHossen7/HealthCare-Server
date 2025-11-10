"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const routes_1 = __importDefault(require("./routes/routes"));
const payment_controller_1 = require("./modules/payment/payment.controller");
const appointment_service_1 = require("./modules/appointment/appointment.service");
const app = (0, express_1.default)();
//parser
app.post("/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.paymentController.handleStripeWebhookEvent);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
node_cron_1.default.schedule("* * * * *", () => {
    console.log("cron is running...");
    try {
        appointment_service_1.appointmentServices.cancelUnpaidAppointment();
    }
    catch (error) {
        console.error(error);
    }
});
// routes
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Welcome to Health Care Server",
        environment: config_1.default.NODE_ENV,
    });
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
