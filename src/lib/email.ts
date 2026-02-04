import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

async function sendEmail({ to, subject, html }: EmailOptions) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_resend_api_key_here") {
        console.log("📧 Email would be sent (Resend not configured):");
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Body: ${html.substring(0, 200)}...`);
        return { success: true, mock: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `Legacy Planning <${fromEmail}>`,
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Email error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email send failed:", error);
        return { success: false, error };
    }
}

export async function sendDMSTriggeredEmail(
    beneficiaryEmail: string,
    beneficiaryName: string,
    ownerName: string,
    accessKey: string
) {
    const claimUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/claim?key=${accessKey}`;

    return sendEmail({
        to: beneficiaryEmail,
        subject: `Important: Legacy Access from ${ownerName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
                    .button { display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
                    .access-key { background: #e0e7ff; padding: 15px; border-radius: 8px; font-family: monospace; margin: 20px 0; word-break: break-all; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Legacy Access Granted</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${beneficiaryName},</p>
                        <p>We are reaching out to inform you that <strong>${ownerName}</strong> has designated you as a beneficiary in their Legacy Planning system.</p>
                        <p>Their Digital Legacy assets are now ready to be accessed. To claim your access, please follow these steps:</p>
                        <ol>
                            <li>Click the button below to access the claim page</li>
                            <li>Enter your access key</li>
                            <li>Complete identity verification</li>
                            <li>Access the secured digital vault</li>
                        </ol>
                        <p><strong>Your Access Key:</strong></p>
                        <div class="access-key">${accessKey}</div>
                        <p style="text-align: center;">
                            <a href="${claimUrl}" class="button">Claim Access Now</a>
                        </p>
                        <p><em>Please keep this access key secure and do not share it with anyone.</em></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from Legacy Planning System.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });
}

export async function sendBeneficiaryAddedEmail(
    beneficiaryEmail: string,
    beneficiaryName: string,
    ownerName: string
) {
    return sendEmail({
        to: beneficiaryEmail,
        subject: `You've been added as a beneficiary by ${ownerName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📋 Beneficiary Notification</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${beneficiaryName},</p>
                        <p><strong>${ownerName}</strong> has added you as a beneficiary in their Legacy Planning system.</p>
                        <p>This means that in the future, you may receive access to their digital assets and important information through a secure verification process.</p>
                        <p><strong>What does this mean?</strong></p>
                        <ul>
                            <li>You have been entrusted with access to important digital assets</li>
                            <li>When the time comes, you will receive detailed instructions via email</li>
                            <li>You will need to verify your identity to access the vault</li>
                        </ul>
                        <p>No action is required from you at this time.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from Legacy Planning System.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });
}

export async function sendAccessGrantedEmail(
    beneficiaryEmail: string,
    beneficiaryName: string,
    accessKey: string
) {
    const vaultUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/vault/${accessKey}`;

    return sendEmail({
        to: beneficiaryEmail,
        subject: "Identity Verified - Access Your Legacy Vault",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
                    .button { display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Identity Verified</h1>
                    </div>
                    <div class="content">
                        <p>Dear ${beneficiaryName},</p>
                        <p>Your identity has been successfully verified. You can now access the Legacy Vault.</p>
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="${vaultUrl}" class="button">Access Vault</a>
                        </p>
                        <p><em>You will need the decryption key provided by the vault owner to access the encrypted contents.</em></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from Legacy Planning System.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });
}
