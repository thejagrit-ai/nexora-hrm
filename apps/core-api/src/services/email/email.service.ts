// =============================================================================
// NEXORA HR — Email Service
//
// Inline HTML templates for the transactional emails NEXORA HR sends:
// password reset, user invitation, email-change notice and welcome.
//
// Transport selection (in order):
//   1. SendGrid — when SENDGRID_API_KEY is set.
//   2. SMTP via nodemailer — when SMTP_HOST is set (Brevo in production,
//      Mailpit/MailHog in local dev).
//   3. No-op — neither configured. sendEmail() logs the would-be delivery
//      at info level and returns. Keeps dev working with zero config and
//      keeps tests deterministic.
//
// Failures are caught and logged but NEVER rethrown — email failures must
// never break the underlying flow (the reset token is still created in
// the DB, the invitation row is still stored, etc.). Users can retry or
// the admin can re-send manually.
// =============================================================================

import sgMail from "@sendgrid/mail";
import nodemailer, { type Transporter } from "nodemailer";
import { config } from "../../config/index.js";
import { logger } from "../../utils/logger.js";

let sendgridReady = false;
let smtpTransporter: Transporter | null = null;

function ensureSendgrid(): boolean {
  if (sendgridReady) return true;
  if (!config.email.sendgridApiKey) return false;
  sgMail.setApiKey(config.email.sendgridApiKey);
  sendgridReady = true;
  return true;
}

function ensureSmtp(): Transporter | null {
  if (smtpTransporter) return smtpTransporter;
  const { smtp } = config.email;
  if (!smtp.host) return null;
  smtpTransporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    // Mailpit/MailHog accept anonymous SMTP — only attach auth when both
    // user and pass are set so empty values don't trigger an auth attempt.
    auth: smtp.user && smtp.pass ? { user: smtp.user, pass: smtp.pass } : undefined,
  });
  return smtpTransporter;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send a transactional email. Tries SendGrid first, falls back to SMTP,
 * and finally no-ops with a log line when neither is configured.
 */
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  if (ensureSendgrid()) {
    try {
      await sgMail.send({
        to: params.to,
        from: {
          email: config.email.fromEmail,
          name: config.email.fromName,
        },
        subject: params.subject,
        html: params.html,
        text: params.text || htmlToPlainText(params.html),
      });
      logger.info(`[email] sent via SendGrid "${params.subject}" to ${params.to}`);
      return true;
    } catch (err: any) {
      const detail =
        err?.response?.body?.errors?.map((e: any) => e.message).join("; ") ||
        err?.message ||
        String(err);
      logger.error(
        `[email] SendGrid send failed for ${params.to} "${params.subject}": ${detail}`,
      );
      // Don't rethrow — fall through and try SMTP if configured. If SMTP
      // also fails, the error is logged and the caller's flow continues.
    }
  }

  const smtp = ensureSmtp();
  if (smtp) {
    try {
      await smtp.sendMail({
        from: { address: config.email.fromEmail, name: config.email.fromName },
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text || htmlToPlainText(params.html),
      });
      logger.info(`[email] sent via SMTP "${params.subject}" to ${params.to}`);
      return true;
    } catch (err: any) {
      logger.error(
        `[email] SMTP send failed for ${params.to} "${params.subject}": ${err?.message || err}`,
      );
      // Swallow — caller's flow continues even if delivery fails.
      return false;
    }
  }

  logger.info(
    `[email] no transport configured (set SENDGRID_API_KEY or SMTP_HOST) — skipping send to ${params.to} "${params.subject}"`,
  );
  return false;
}

/** Very rough HTML → plain-text fallback for the `text` body. */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function layout(innerHtml: string, preheader: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>NEXORA HR</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:${FONT};color:#1f2937;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}&#8199;&zwnj;&#8199;&zwnj;&#8199;&zwnj;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;">
<tr><td style="padding:0 4px 20px;font-family:${FONT};font-size:18px;font-weight:700;letter-spacing:0.5px;color:#111827;">NEXORA<span style="color:#4f46e5;"> HR</span></td></tr>
<tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:36px 36px 32px;font-family:${FONT};font-size:15px;line-height:1.6;color:#374151;">${innerHtml}</td></tr>
<tr><td style="padding:20px 4px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:#9ca3af;">
This is an automated message from NEXORA HR. Please do not reply to this email.<br>
If you weren't expecting it, you can safely ignore it.
</td></tr>
</table></td></tr></table></body></html>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 20px;font-family:${FONT};font-size:20px;line-height:1.3;font-weight:600;color:#111827;">${text}</h1>`;
}

function para(html: string): string {
  return `<p style="margin:0 0 16px;">${html}</p>`;
}

function note(html: string): string {
  return `<p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#6b7280;">${html}</p>`;
}

function linkFallback(href: string): string {
  return `${note("Button not working? Copy and paste this link into your browser:")}
<p style="margin:0;font-size:13px;line-height:1.5;word-break:break-all;"><a href="${escapeHtml(href)}" style="color:#4f46e5;text-decoration:underline;">${escapeHtml(href)}</a></p>`;
}

function button(label: string, href: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 28px;">
<tr><td style="border-radius:6px;background:#4f46e5;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:15px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:6px;">${escapeHtml(label)}</a>
</td></tr></table>`;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Turn a plain-text message (blank-line-separated paragraphs, single newlines
 * within a paragraph) into branded HTML paragraphs. The text is HTML-escaped
 * first, so an admin-authored template body is treated as plain text — exactly
 * what the "simple" template editor promises — and can never inject markup.
 */
function messageToParagraphs(message: string): string {
  return message
    .split(/\n{2,}/)
    .map((p) => {
      const html = escapeHtml(p.trim()).replace(/\n/g, "<br>");
      return html ? para(html) : "";
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Render a branded email from a plain-text message body — used by the
 * template-driven emails (e.g. probation confirmation). Wraps the message in
 * the same layout as the transactional emails.
 */
export function renderBrandedEmail(message: string): { html: string; text: string } {
  return {
    // Empty preheader: the subject is already the email's subject line, and
    // passing it here duplicated it as a redundant heading at the top of the
    // email body in some clients. The plain-text alternative is just the
    // message itself — clean, with no layout chrome or HTML entities.
    html: layout(messageToParagraphs(message), ""),
    text: message,
  };
}

export async function sendBrandedEmail(params: {
  to: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const { html, text } = renderBrandedEmail(params.message);
  return sendEmail({ to: params.to, subject: params.subject, html, text });
}

// ---------------------------------------------------------------------------
// Specific emails
// ---------------------------------------------------------------------------

/**
 * Password reset email — sent when a user requests to reset their password.
 * Contains a link back to the web app's reset page with the single-use token.
 */
export async function sendPasswordResetEmail(params: {
  to: string;
  firstName: string;
  token: string;
}): Promise<void> {
  const url = `${config.email.appUrl.replace(/\/+$/, "")}/reset-password?token=${encodeURIComponent(params.token)}`;
  const greeting = params.firstName ? `Hi ${escapeHtml(params.firstName)},` : "Hi,";

  const html = layout(
    [
      heading("Reset your password"),
      para(greeting),
      para(
        "We received a request to reset the password for your NEXORA HR account. Use the button below to choose a new one. This link expires in 1 hour and can only be used once.",
      ),
      button("Reset password", url),
      linkFallback(url),
      `<hr style="border:0;border-top:1px solid #e5e7eb;margin:28px 0 20px;">`,
      note(
        "If you didn't request a password reset, no action is needed — your password will stay the same. If you're concerned about your account's security, contact your HR administrator.",
      ),
    ].join("\n"),
    "Use this link to reset your NEXORA HR password. It expires in 1 hour.",
  );

  await sendEmail({
    to: params.to,
    subject: "Reset your NEXORA HR password",
    html,
    text: `${params.firstName ? `Hi ${params.firstName},` : "Hi,"}\n\nWe received a request to reset your NEXORA HR password. Open this link to choose a new one (valid for 1 hour, single use):\n\n${url}\n\nIf you didn't request this, you can ignore this email — your password will not change.`,
  });
}

/**
 * Invitation email — sent when an org admin invites a new user to join.
 * The accept-invitation link takes them to a page that sets their password
 * and activates their user record.
 */
export async function sendInvitationEmail(params: {
  to: string;
  firstName?: string | null;
  orgName: string;
  invitedByName: string;
  role: string;
  token: string;
}): Promise<void> {
  const url = `${config.email.appUrl.replace(/\/+$/, "")}/accept-invitation?token=${encodeURIComponent(params.token)}`;
  const greeting = params.firstName ? `Hi ${escapeHtml(params.firstName)},` : "Hi,";
  const roleLabel = escapeHtml(params.role.replace(/_/g, " "));

  const html = layout(
    [
      heading(`Join ${escapeHtml(params.orgName)} on NEXORA HR`),
      para(greeting),
      para(
        `<strong>${escapeHtml(params.invitedByName)}</strong> has invited you to join <strong>${escapeHtml(params.orgName)}</strong> on NEXORA HR with the role of <strong>${roleLabel}</strong>.`,
      ),
      para(
        "Accept the invitation to set your password and activate your account. The invitation expires in 7 days.",
      ),
      button("Accept invitation", url),
      linkFallback(url),
    ].join("\n"),
    `${params.invitedByName} invited you to join ${params.orgName} on NEXORA HR.`,
  );

  await sendEmail({
    to: params.to,
    subject: `${params.invitedByName} invited you to join ${params.orgName} on NEXORA HR`,
    html,
    text: `${params.firstName ? `Hi ${params.firstName},` : "Hi,"}\n\n${params.invitedByName} has invited you to join ${params.orgName} on NEXORA HR as ${params.role.replace(/_/g, " ")}.\n\nAccept the invitation (valid for 7 days):\n${url}`,
  });
}

/**
 * Email-change notification — sent to BOTH the old and new addresses
 * after an HR admin updates an employee's login email.
 *
 *   "old" → security notice to the previous address.
 *   "new" → confirmation to the new address.
 */
export async function sendEmailChangedNotification(params: {
  to: string;
  firstName?: string | null;
  oldEmail: string;
  newEmail: string;
  recipientType: "old" | "new";
}): Promise<void> {
  const greeting = params.firstName ? `Hi ${escapeHtml(params.firstName)},` : "Hi,";
  const recipientNote =
    params.recipientType === "old"
      ? "You are receiving this notice at your previous address. You will no longer be able to sign in with it."
      : "You are receiving this confirmation at your new address. Use it to sign in from now on.";
  const loginUrl = `${config.email.appUrl.replace(/\/+$/, "")}/login`;
  const row = (label: string, value: string, top: boolean) =>
    `<tr><td style="padding:12px 16px;font-size:13px;color:#6b7280;width:130px;${top ? "border-top:1px solid #e5e7eb;" : ""}">${label}</td><td style="padding:12px 16px;font-size:14px;color:#111827;font-weight:600;${top ? "border-top:1px solid #e5e7eb;" : ""}">${escapeHtml(value)}</td></tr>`;

  const html = layout(
    [
      heading("Your login email was changed"),
      para(greeting),
      para("Your administrator updated the email address you use to sign in to NEXORA HR."),
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px;border:1px solid #e5e7eb;border-radius:6px;border-collapse:separate;">${row("Previous email", params.oldEmail, false)}${row("New email", params.newEmail, true)}</table>`,
      para(recipientNote),
      button("Sign in", loginUrl),
      `<hr style="border:0;border-top:1px solid #e5e7eb;margin:8px 0 20px;">`,
      note("<strong>Didn't expect this change?</strong> Contact your HR administrator right away."),
    ].join("\n"),
    "Your NEXORA HR login email was changed.",
  );

  await sendEmail({
    to: params.to,
    subject: "Your NEXORA HR login email was changed",
    html,
  });
}

/**
 * Welcome email — sent after a brand-new org admin finishes registration.
 */
export async function sendWelcomeEmail(params: {
  to: string;
  firstName: string;
  orgName: string;
}): Promise<void> {
  const url = `${config.email.appUrl.replace(/\/+$/, "")}/login`;
  const li = (t: string) => `<li style="margin:0 0 8px;">${t}</li>`;

  const html = layout(
    [
      heading(`Welcome to NEXORA HR, ${escapeHtml(params.firstName)}`),
      para(
        `Your organization <strong>${escapeHtml(params.orgName)}</strong> has been created and is ready to use.`,
      ),
      button("Sign in to NEXORA HR", url),
      para("<strong>To get started:</strong>"),
      `<ul style="margin:0 0 20px;padding-left:20px;">${li("Complete the setup wizard — departments, locations and your office calendar")}${li("Invite your team so they can set up their accounts")}${li("Enable the modules your company needs, such as payroll and recruitment")}</ul>`,
    ].join("\n"),
    `Your organization ${params.orgName} is ready on NEXORA HR.`,
  );

  await sendEmail({
    to: params.to,
    subject: `Welcome to NEXORA HR, ${params.firstName}`,
    html,
  });
}
