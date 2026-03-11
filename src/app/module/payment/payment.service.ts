import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { env } from "node:process";
import { PaymentStatus } from "../../../generated/prisma/enums";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {

    const existingPayment = await prisma.payment.findUnique({
        where: {
            id: event.id
        }
    });

    if (existingPayment) {
        console.log(`Event ${event.id} already processed. Skipping`);
        return { message: `Event ${event.id} already processed. Skipping` }
    }

    switch (event.type) {
        case "checkout.session.completed":{
            const session = event.data.object as Stripe.Checkout.Session;

            const appointmentId = session.metadata?.appointmentId;
            const paymentId = session.metadata?.paymentId;

            if(!appointmentId || !paymentId) {
                console.error('Invalid checkout session data');
                return {message: 'Invalid checkout session data'}
            }

            const appointment = await prisma.appointment.findUnique({
                where: {
                    id: appointmentId
                }
            });

            if(!appointment) {
                console.error('Invalid checkout session data');
                return {message: 'Invalid checkout session data'}
            }

            await prisma.$transaction(async (tx) => {
                await tx.appointment.update({
                    where: {
                        id: appointmentId
                    },
                    data: {
                        paymentStatus: session.payment_status === 'paid'? PaymentStatus.PAID : PaymentStatus.UNPAID,
                    }
                });

                await tx.payment.update({
                    where: {
                        id: paymentId
                    },
                    data: {
                        status: session.payment_status === 'paid'? PaymentStatus.PAID : PaymentStatus.UNPAID,
                    }
                })
            })
        }
        case 'checkout.session.expired':{}
        case 'payment_intent.payment_failed':{}
        default:
            console.log("Unhandled type ", event.type);

    }
}