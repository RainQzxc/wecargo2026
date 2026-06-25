import "server-only";

import { Resend } from "resend";

/**
 * Transactional email via Resend. In dev with no RESEND_API_KEY the send is
 * logged and skipped instead of throwing, so local flows don't break.
 *
 * NOTE: the default RESEND_FROM (onboarding@resend.dev) can only send to the
 * account owner's address. Verify a domain before sending to real users.
 */

let client: Resend | null = null;

function getClient(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

function from(): string {
  return process.env.RESEND_FROM ?? "WeCargo <onboarding@resend.dev>";
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  id: string | null;
  skipped?: boolean;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const resend = getClient();
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY unset — skipping send to ${input.to} ("${input.subject}")`,
    );
    return { id: null, skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: from(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });

  if (error) {
    console.error("[email] send failed:", error);
    throw new Error(`Email send failed: ${error.message}`);
  }
  return { id: data?.id ?? null };
}

// ---------------------------------------------------------------------------
// Templates — Mongolian copy to match the app. Keep inline; small + few of them.
// ---------------------------------------------------------------------------

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#171717">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px">
    <div style="background:#fff;border-radius:12px;padding:32px">
      <h1 style="font-size:20px;margin:0 0 16px">${title}</h1>
      ${bodyHtml}
    </div>
    <p style="text-align:center;color:#a3a3a3;font-size:12px;margin-top:24px">WeCargo · Карго тээвэр</p>
  </div></body></html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">${label}</a>`;
}

export function passwordResetEmail(resetUrl: string): { subject: string; html: string; text: string } {
  return {
    subject: "WeCargo — нууц үг сэргээх",
    html: layout(
      "Нууц үг сэргээх",
      `<p style="font-size:14px;line-height:1.6">Та нууц үгээ сэргээх хүсэлт илгээсэн. Доорх товчийг дарж шинэ нууц үг тохируулна уу. Холбоос 1 цагийн дараа хүчингүй болно.</p>
       <p style="margin:24px 0">${button(resetUrl, "Нууц үг сэргээх")}</p>
       <p style="font-size:12px;color:#737373">Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ имэйлийг үл тоомсорлоно уу.</p>`,
    ),
    text: `Нууц үг сэргээх: ${resetUrl} (1 цагийн дотор хүчинтэй)`,
  };
}

export function welcomeEmail(name: string, loginUrl: string): { subject: string; html: string; text: string } {
  return {
    subject: "WeCargo-д тавтай морил!",
    html: layout(
      "Тавтай морил! 🎉",
      `<p style="font-size:14px;line-height:1.6">Сайн байна уу, ${name}. Таны WeCargo бүртгэл амжилттай үүслээ. Одоо ачаагаа бүртгэж, хянах боломжтой.</p>
       <p style="margin:24px 0">${button(loginUrl, "Нэвтрэх")}</p>`,
    ),
    text: `Тавтай морил, ${name}! Нэвтрэх: ${loginUrl}`,
  };
}
