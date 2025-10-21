import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { stripe } from "../../config/stripe.config";
import { paymentServices } from "./payment.services";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = config.STRIPE.webhook_secret;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const result = await paymentServices.handleStripeWebhookEvent(event);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Webhook req send successfully",
      data: result,
    });
  }
);

export const paymentController = {
  handleStripeWebhookEvent,
};
