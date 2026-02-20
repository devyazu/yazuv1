import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: true },
  });
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.warn("SMTP not configured; skipping verification email.");
    return false;
  }
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "yazu";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@yazu.digital";

  try {
    await transport.sendMail({
      from: `"${appName}" <${from}>`,
      to,
      subject: "yazu — E-posta adresinizi doğrulayın",
      text: `Merhaba,\n\nE-posta adresinizi doğrulamak için aşağıdaki linke tıklayın:\n\n${verifyUrl}\n\nBu link 24 saat geçerlidir. Eğer bu işlemi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.\n\n— yazu`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;">
          <p style="color:#444;">Merhaba,</p>
          <p style="color:#444;">E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>
          <p style="margin:24px 0;">
            <a href="${verifyUrl}" style="display:inline-block;background:#e66000;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;">E-postayı doğrula</a>
          </p>
          <p style="color:#737373;font-size:14px;">Veya bu linki tarayıcıya kopyalayın:<br/><a href="${verifyUrl}" style="color:#e66000;">${verifyUrl}</a></p>
          <p style="color:#737373;font-size:13px;">Bu link 24 saat geçerlidir. Bu işlemi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>
          <p style="color:#999;font-size:12px;margin-top:32px;">— yazu</p>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("Send verification email error:", e);
    return false;
  }
}
