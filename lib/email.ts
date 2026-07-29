import bcrypt from "bcryptjs";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL ||
    "TS Technology <ts.technology.ccu@gmail.com>";

export function generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOtp(code: string): Promise<string> {
    return bcrypt.hash(code, 10);
}

export async function verifyOtpHash(
    code: string,
    hash: string,
): Promise<boolean> {
    return bcrypt.compare(code, hash);
}

interface SendOtpEmailParams {
    to: string;
    code: string;
    purpose: "signin" | "signup";
}

export async function sendOtpEmail({
    to,
    code,
    purpose,
}: SendOtpEmailParams): Promise<{ success: boolean; error?: string }> {
    if (!RESEND_API_KEY) {
        return {
            success: false,
            error: "Email service is not configured. Please set RESEND_API_KEY.",
        };
    }

    const subject =
        purpose === "signup" ?
            "Your TS Technology signup code"
        :   "Your TS Technology sign-in code";
    const action =
        purpose === "signup" ? "creating your account" : "signing in";

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1d27;border-radius:16px;overflow:hidden;border:1px solid rgba(212,175,55,0.15);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 8px;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#d4af37;letter-spacing:-0.3px;">TS Technology</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:8px 40px 16px;">
              <p style="margin:0 0 6px;font-size:15px;color:#a0a3b1;line-height:1.5;">
                You're ${action}. Use the code below to verify your email address:
              </p>
            </td>
          </tr>
          <!-- OTP Code -->
          <tr>
            <td align="center" style="padding:8px 40px 24px;">
              <div style="background:#0f1117;border:1px solid rgba(212,175,55,0.25);border-radius:12px;padding:24px 32px;display:inline-block;">
                <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#d4af37;font-family:'Courier New',monospace;">${code}</span>
              </div>
            </td>
          </tr>
          <!-- Expiry note -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:13px;color:#6b6e7d;line-height:1.5;">
                This code expires in <strong style="color:#a0a3b1;">10 minutes</strong>. If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;font-size:12px;color:#4a4d5a;line-height:1.5;">
                TS Technology — Premium tech accessories. This is an automated email, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: [to],
                subject,
                html,
            }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            return {
                success: false,
                error: `Email service error: ${res.status}`,
            };
        }

        return { success: true };
    } catch {
        return {
            success: false,
            error: "Failed to send email. Please try again.",
        };
    }
}
