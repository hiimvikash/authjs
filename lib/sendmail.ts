import { EmailTemplate } from "@/components/auth/mail-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationMail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "nextauth@resend.dev",
    to: email,
    subject: "Verify your email.",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    // react : EmailTemplate({firstName : "JOHN"})
  });
};
export const sendResetMail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "nextauth@resend.dev",
    to: email,
    subject: "Reset your password.",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    // react : EmailTemplate({firstName : "JOHN"})
  });
};

export const sendTwoFactorTokenMail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "nextauth@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};
