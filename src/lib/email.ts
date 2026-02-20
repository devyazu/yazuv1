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
  });
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) {
    console.warn("SMTP not configured; skipping verification email.");
    return false;
  }
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Yazu";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@yazu.digital";

  try {
    await transport.sendMail({
      from: `"${appName}" <${from}>`,
      to,
      subject: "E-posta adresinizi doğrulayın",
      text: `E-posta adresinizi doğrulamak için aşağıdaki linke tıklayın:\n\n${verifyUrl}\n\nBu link 24 saat geçerlidir.`,
      html: `
        <p>E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>
        <p><a href="${verifyUrl}" style="display:inline-block;background:#e85d04;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;">E-postayı doğrula</a></p>
        <p>Veya bu linki tarayıcıya yapıştırın: <a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Bu link 24 saat geçerlidir.</p>
      `,
    });
    return true;
  } catch (e) {
    console.error("Send verification email error:", e);
    return false;
  }
}
