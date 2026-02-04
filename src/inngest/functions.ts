import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { sendDMSTriggeredEmail } from "@/lib/email";

export const checkDmsStatus = inngest.createFunction(
    { id: "check-dms-status" },
    { event: "dms.reset" },
    async ({ event, step }) => {
        const { userId, email, period } = event.data;

        // 1. Wait for the DMS period (e.g. 30 days)
        await step.sleep("wait-for-period", `${period} days`);

        // 2. Check User Activity
        const user = await step.run("check-user-activity", async () => {
            const u = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    beneficiaries: true,
                },
            });
            return u;
        });

        if (!user) return { status: "User not found" };

        const lastActive = new Date(user.lastActive);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastActive.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < period) {
            // User has been active recently! Restart the timer.
            await step.sendEvent("restart-timer", {
                name: "dms.reset",
                data: { userId, email, period },
            });
            return { status: "User active, timer reset" };
        } else {
            // User is INACTIVE! Trigger the Dead Man's Switch.

            // 3. Update Status to TRIGGERED
            await step.run("mark-as-triggered", async () => {
                await prisma.user.update({
                    where: { id: userId },
                    data: { dmsStatus: "TRIGGERED" },
                });

                // Log activity
                await prisma.activityLog.create({
                    data: {
                        type: "dms_triggered",
                        message: `Dead Man's Switch activated after ${period} days of inactivity`,
                        userId: userId,
                    },
                });
            });

            // 4. Send Notification to All Beneficiaries
            await step.run("notify-beneficiaries", async () => {
                const ownerName = user.name || user.email;

                for (const beneficiary of user.beneficiaries) {
                    console.log(`Sending DMS notification to ${beneficiary.email}...`);

                    await sendDMSTriggeredEmail(
                        beneficiary.email,
                        beneficiary.name,
                        ownerName,
                        beneficiary.accessKey
                    );

                    console.log(`✓ Email sent to ${beneficiary.email}`);
                }

                console.log(`DMS TRIGGERED for ${email}. Notified ${user.beneficiaries.length} beneficiaries.`);
            });

            return {
                status: "DMS Triggered",
                beneficiariesNotified: user.beneficiaries.length
            };
        }
    }
);
