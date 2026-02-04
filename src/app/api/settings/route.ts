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
            select: {
                name: true,
                dmsPeriod: true,
                notifyEmail: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Settings GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { dmsPeriod, notifyEmail, name } = await request.json();

        // Validate dmsPeriod
        if (dmsPeriod !== undefined && (dmsPeriod < 7 || dmsPeriod > 90)) {
            return NextResponse.json({ error: "DMS period must be between 7 and 90 days" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                ...(dmsPeriod !== undefined && { dmsPeriod }),
                ...(notifyEmail !== undefined && { notifyEmail }),
                ...(name !== undefined && { name }),
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: "settings_updated",
                message: "Updated account settings",
                userId: user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Settings PUT error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
