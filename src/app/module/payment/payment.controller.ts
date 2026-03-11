import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { envVars } from "../../../config/env";
import status from "http-status";
import { stripe } from "../../../config/stripe.config";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../shared/sendResponse";


const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        console.log("Missing stripe signature or webhook secret");
        return res.status(status.BAD_REQUEST).
            json({ message: 'Missing stripe signature or webhook secret' });
    }
    let event;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error.message);
        return res.status(status.BAD_REQUEST).json({ message: error.message });
    }

    try {
        const result = await PaymentService.handleStripeWebhookEvent(event)
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Payment processed successfully",
            data: result
        })
    } catch (error) {
        console.log('Error handling Stripe webhook event', error);
        sendResponse(res, {
            httpStatusCode: status.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Error handling Stripe webhook event",
        })
    }
})

export const PaymentController = {
    handleStripeWebhookEvent
}