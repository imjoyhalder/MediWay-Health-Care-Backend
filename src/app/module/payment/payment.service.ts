import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

import { PaymentStatus } from "../../../generated/prisma/enums";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {

    const existingPayment = await prisma.payment.findUnique({
        where: {
            stripeEventId: event.id
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
                        // stripeEventId: paymentId
                        id: paymentId
                    },
                    data: {
                        status: session.payment_status === 'paid'? PaymentStatus.PAID : PaymentStatus.UNPAID,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        paymentGatewayData: session as any,
                        stripeEventId: event.id
                    }   
                }); 
            })

            console.log(`processed checkout session completed for appointment ${appointmentId} and payment ${paymentId}`);
            break; 
        }
        case 'checkout.session.expired':{
            const session = event.data.object as Stripe.Checkout.Session;
            
            console.log(`CheckOut session ${session.id} expired. Marking associated payment as failed. `);
            break; 
            
        }
        case 'payment_intent.payment_failed':{
            const session = event.data.object as Stripe.PaymentIntent;
            
            console.log(`Payment Intent ${session.id} failed. Marking associated payment as failed. `);
            break;
        }
        default:
            console.log("Unhandled type ", event.type);

    }

    return {message: `webhook event ${event.id} processed successfully`};
}

export const PaymentService = {
    handleStripeWebhookEvent
}

