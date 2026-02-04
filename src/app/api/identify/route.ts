import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");

export async function POST(request: Request) {
    try {
        const { accessKey } = await request.json();

        if (!accessKey) {
            return NextResponse.json({ error: "Access Key required" }, { status: 400 });
        }

        // Find beneficiary by access key
        const beneficiary = await prisma.beneficiary.findUnique({
            where: { accessKey },
            include: {
                user: true,
            },
        });

        if (!beneficiary) {
            return NextResponse.json({ error: "Invalid access key" }, { status: 404 });
        }

        // Check if DMS is triggered
        if (beneficiary.user.dmsStatus !== "TRIGGERED") {
            return NextResponse.json(
                { error: "Vault is not accessible. The owner is still active." },
                { status: 403 }
            );
        }

        // Check if already verified
        if (beneficiary.verificationStatus === "VERIFIED") {
            return NextResponse.json({
                verified: true,
                message: "Already verified. Redirecting to vault...",
                redirectTo: `/vault/${accessKey}`,
            });
        }

        // Create Stripe Identity Verification Session
        const verificationSession = await stripe.identity.verificationSessions.create({
            type: "document",
            options: {
                document: {
                    allowed_types: ["passport", "driving_license", "id_card"],
                    require_live_capture: true,
                    require_matching_selfie: true,
                },
            },
            metadata: {
                beneficiary_id: beneficiary.id,
                access_key: accessKey,
            },
            return_url: `${process.env.NEXTAUTH_URL}/vault/${accessKey}`,
        });

        // Update beneficiary with session ID
        await prisma.beneficiary.update({
            where: { id: beneficiary.id },
            data: {
                stripeSessionId: verificationSession.id,
                verificationStatus: "PENDING",
            },
        });

        return NextResponse.json({
            clientSecret: verificationSession.client_secret,
            sessionId: verificationSession.id,
        });
    } catch (error: any) {
        console.error("Identity verification error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
