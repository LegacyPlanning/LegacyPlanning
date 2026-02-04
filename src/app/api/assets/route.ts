import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

        const assets = await prisma.asset.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                type: true,
                platform: true,
                createdAt: true,
                // Don't return encryptedData in list
            },
        });

        return NextResponse.json({ assets });
    } catch (error) {
        console.error("Assets GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, type, platform, encryptedData } = await request.json();

        if (!encryptedData || !type || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const asset = await prisma.asset.create({
            data: {
                userId: user.id,
                name,
                type,
                platform: platform || null,
                encryptedData,
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: "asset_added",
                message: `Added ${name} to vault`,
                userId: user.id,
            },
        });

        return NextResponse.json({ success: true, assetId: asset.id });
    } catch (error) {
        console.error("Assets POST error:", error);
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
            return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify ownership
        const asset = await prisma.asset.findFirst({
            where: { id, userId: user.id },
        });

        if (!asset) {
            return NextResponse.json({ error: "Asset not found" }, { status: 404 });
        }

        await prisma.asset.delete({
            where: { id },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: "asset_removed",
                message: `Removed ${asset.name} from vault`,
                userId: user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Assets DELETE error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
