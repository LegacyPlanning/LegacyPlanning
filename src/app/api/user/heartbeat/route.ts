import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Determine email from session or request body
        let email: string | null = null;

        if (session?.user?.email) {
            email = session.user.email;
        } else {
            const body = await request.json().catch(() => ({}));
            email = body.email;
        }

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { email },
            data: {
                lastActive: new Date(),
                dmsStatus: "ACTIVE",
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                type: "heartbeat",
                message: "Activity check-in (I'm Still Here)",
                userId: user.id,
            },
        });

        // Send event to Inngest to reset the DMS timer
        await inngest.send({
            name: "dms.reset",
            data: {
                userId: user.id,
                email: user.email,
                period: user.dmsPeriod,
            },
        });

        return NextResponse.json({ success: true, lastActive: user.lastActive });
    } catch (error) {
        console.error("Heartbeat error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
