import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ accessKey: string }> }
) {
    try {
        const { accessKey } = await params;

        if (!accessKey) {
            return NextResponse.json({ error: "Access key required" }, { status: 400 });
        }

        // Find beneficiary by access key
        const beneficiary = await prisma.beneficiary.findUnique({
            where: { accessKey },
            include: {
                user: {
                    include: {
                        assets: true,
                    },
                },
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

        // Check if beneficiary is verified
        if (beneficiary.verificationStatus !== "VERIFIED") {
            return NextResponse.json({
                beneficiary: {
                    name: beneficiary.name,
                    verificationStatus: beneficiary.verificationStatus,
                    accessGrantedAt: beneficiary.accessGrantedAt,
                },
                owner: {
                    name: beneficiary.user.name || "Unknown",
                },
                assets: [],
            });
        }

        // Return vault data
        return NextResponse.json({
            beneficiary: {
                name: beneficiary.name,
                verificationStatus: beneficiary.verificationStatus,
                accessGrantedAt: beneficiary.accessGrantedAt?.toISOString(),
            },
            owner: {
                name: beneficiary.user.name || beneficiary.user.email,
            },
            assets: beneficiary.user.assets.map((asset) => ({
                id: asset.id,
                name: asset.name,
                type: asset.type,
                platform: asset.platform,
                encryptedData: asset.encryptedData,
            })),
        });
    } catch (error) {
        console.error("Vault access error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
