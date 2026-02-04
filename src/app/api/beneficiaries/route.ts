import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBeneficiaryAddedEmail } from "@/lib/email";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const beneficiaries = await prisma.beneficiary.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ beneficiaries });
    } catch (error) {
        console.error("Beneficiaries GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, email, relationship } = await request.json();

        if (!name || !email || !relationship) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if beneficiary already exists
        const existingBeneficiary = await prisma.beneficiary.findFirst({
            where: { email, userId: user.id },
        });

        if (existingBeneficiary) {
            return NextResponse.json({ error: "Beneficiary with this email already exists" }, { status: 400 });
        }

        const beneficiary = await prisma.beneficiary.create({
            data: {
                name,
                email,
                relationship,
                userId: user.id,
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: "beneficiary_added",
                message: `Added ${name} as beneficiary`,
                userId: user.id,
            },
        });

        // Send notification email
        await sendBeneficiaryAddedEmail(email, name, user.name || user.email);

        return NextResponse.json({ success: true, beneficiary });
    } catch (error) {
        console.error("Beneficiaries POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Beneficiary ID required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify ownership
        const beneficiary = await prisma.beneficiary.findFirst({
            where: { id, userId: user.id },
        });

        if (!beneficiary) {
            return NextResponse.json({ error: "Beneficiary not found" }, { status: 404 });
        }

        await prisma.beneficiary.delete({
            where: { id },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: "beneficiary_removed",
                message: `Removed ${beneficiary.name} as beneficiary`,
                userId: user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Beneficiaries DELETE error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
