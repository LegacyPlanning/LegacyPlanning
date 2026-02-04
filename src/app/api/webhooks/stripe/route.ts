import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendAccessGrantedEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "identity.verification_session.verified": {
            const session = event.data.object as Stripe.Identity.VerificationSession;
            const beneficiaryId = session.metadata?.beneficiary_id;

            if (beneficiaryId) {
                try {
                    // Update beneficiary verification status
                    const beneficiary = await prisma.beneficiary.update({
                        where: { id: beneficiaryId },
                        data: {
                            verificationStatus: "VERIFIED",
                            stripeSessionId: session.id,
                            accessGrantedAt: new Date(),
                        },
                        include: {
                            user: true,
                        },
                    });

                    // Log activity
                    await prisma.activityLog.create({
                        data: {
                            type: "beneficiary_verified",
                            message: `${beneficiary.name} completed identity verification`,
                            userId: beneficiary.userId,
                        },
                    });

                    // Send access granted email
                    await sendAccessGrantedEmail(
                        beneficiary.email,
                        beneficiary.name,
                        beneficiary.accessKey
                    );

                    console.log(`✓ Beneficiary ${beneficiary.name} verified successfully`);
                } catch (error) {
                    console.error("Error updating beneficiary:", error);
                }
            }
            break;
        }

        case "identity.verification_session.requires_input": {
            const session = event.data.object as Stripe.Identity.VerificationSession;
            const beneficiaryId = session.metadata?.beneficiary_id;

            if (beneficiaryId) {
                await prisma.beneficiary.update({
                    where: { id: beneficiaryId },
                    data: {
                        verificationStatus: "PENDING",
                        stripeSessionId: session.id,
                    },
                });
            }
            break;
        }

        case "identity.verification_session.canceled": {
            const session = event.data.object as Stripe.Identity.VerificationSession;
            const beneficiaryId = session.metadata?.beneficiary_id;

            if (beneficiaryId) {
                await prisma.beneficiary.update({
                    where: { id: beneficiaryId },
                    data: {
                        verificationStatus: "FAILED",
                        stripeSessionId: session.id,
                    },
                });
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
