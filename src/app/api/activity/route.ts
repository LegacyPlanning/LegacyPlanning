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

        const activities = await prisma.activityLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        return NextResponse.json({ activities });
    } catch (error) {
        console.error("Activity error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
