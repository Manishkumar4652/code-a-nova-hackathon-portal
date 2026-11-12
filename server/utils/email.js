import nodemailer from 'nodemailer';
import { escapeHtml } from './validators.js';

/** Official sender name — never a personal / candidate name */
const SENDER_NAME = 'Code-a-Nova';

/**
 * Check if email credentials (HTTP webhook, Brevo, Resend, or SMTP) are configured in environment
 */
export const isSmtpConfigured = () => {
  return Boolean(
    process.env.EMAIL_WEBHOOK_URL ||
    process.env.BREVO_API_KEY ||
    process.env.RESEND_API_KEY ||
    (process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_USER.trim() !== '' &&
      process.env.EMAIL_PASS.trim() !== '')
  );
};

/**
 * Create Nodemailer transporter based on environment configuration
 */
export const createTransporter = () => {
  if (isSmtpConfigured()) {
    const isGmail =
      (process.env.EMAIL_HOST && process.env.EMAIL_HOST.toLowerCase().includes('gmail')) ||
      (process.env.EMAIL_USER && process.env.EMAIL_USER.toLowerCase().endsWith('@gmail.com'));

    const cleanPass = process.env.EMAIL_PASS.replace(/\s+/g, '');
    const cleanUser = process.env.EMAIL_USER.trim();

    if (isGmail) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: cleanUser,
          pass: cleanPass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      });
    }

    const port = Number(process.env.EMAIL_PORT) || 465;
    const isSecure = port === 465;

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port,
      secure: isSecure,
      auth: {
        user: cleanUser,
        pass: cleanPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }

  // Fallback to jsonTransport for local testing without credentials
  return nodemailer.createTransport({ jsonTransport: true });
};

/**
 * Verify SMTP connection safely without logging credentials or raw secrets
 */
export const verifySMTPConnection = async () => {
  if (!isSmtpConfigured()) {
    return {
      configured: false,
      success: false,
      message: 'SMTP credentials (EMAIL_USER and/or EMAIL_PASS) are missing or empty in server/.env.',
    };
  }

  const transporter = createTransporter();
  try {
    await transporter.verify();
    return {
      configured: true,
      success: true,
      message: 'SMTP server connection established and verified successfully.',
    };
  } catch (error) {
    let safeMessage = error.message || 'SMTP connection/authentication failed.';
    if (process.env.EMAIL_PASS) {
      safeMessage = safeMessage.replaceAll(process.env.EMAIL_PASS.trim(), '[REDACTED_PASSWORD]');
      safeMessage = safeMessage.replaceAll(process.env.EMAIL_PASS.replace(/\s+/g, ''), '[REDACTED_PASSWORD]');
    }
    if (process.env.EMAIL_USER) {
      safeMessage = safeMessage.replaceAll(process.env.EMAIL_USER.trim(), '[REDACTED_USER]');
    }
    return { configured: true, success: false, message: safeMessage };
  }
};

/**
 * Official "from" header — always Code-a-Nova.
 */
const getSenderAddress = () =>
  isSmtpConfigured()
    ? `"${SENDER_NAME}" <${process.env.EMAIL_USER.trim()}>`
    : `"${SENDER_NAME}" <noreply@localhost>`;

/* -------------------------------------------------------------------------- */
/*  Email layout (inline CSS only — email clients ignore <style> blocks)       */
/* -------------------------------------------------------------------------- */

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', monospace";

/**
 * Wrap body HTML in the shared Code-a-Nova email shell.
 */
const renderShell = ({ title, eyebrow, bodyHtml }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f2ea;font-family:${FONT};color:#16181d;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f2ea;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#fffdf8;border:1px solid #d9d4c6;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#0f1b2d;padding:24px 32px;">
              <div style="font-size:20px;font-weight:700;color:#fffdf8;letter-spacing:-0.2px;">Code<span style="color:#ff7a45;">-a-</span>Nova</div>
              <div style="margin-top:4px;font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#aab4c5;">${escapeHtml(eyebrow)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background-color:#ece8dd;border-top:1px solid #d9d4c6;">
              <div style="font-size:12px;color:#5e6370;">&copy; ${new Date().getFullYear()} Code-a-Nova. All rights reserved.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

/**
 * Generate HTML for the OTP verification email
 * @param {string} recipientName
 * @param {string} otp
 */
export const generateOTPEmailHTML = (recipientName, otp) =>
  renderShell({
    title: 'Code-a-Nova Verification Code',
    eyebrow: 'Email verification',
    bodyHtml: `
      <h2 style="margin:0 0 12px;font-size:20px;color:#16181d;">Verify your email address</h2>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4a4f5a;">
        Hello <strong>${escapeHtml(recipientName || 'Participant')}</strong>,<br>
        use the 6-digit one-time password below to finish creating your Code-a-Nova account.
      </p>
      <div style="background-color:#f5f2ea;border:1px dashed #d4410f;border-radius:10px;padding:20px;text-align:center;margin:0 0 24px;">
        <span style="font-family:${MONO};font-size:34px;font-weight:700;letter-spacing:10px;color:#d4410f;">${escapeHtml(otp)}</span>
      </div>
      <p style="margin:0 0 8px;font-size:13px;color:#8a4b00;font-weight:600;">This code expires in 10 minutes and works only once.</p>
      <p style="margin:0;font-size:12px;line-height:1.5;color:#5e6370;">
        If you did not create this account you can safely ignore this email. Never share this code with anyone.
      </p>`,
  });

/**
 * Generate HTML for the Hackathon Registration Confirmation email
 */
export const generateConfirmationEmailHTML = ({
  participantName,
  participantEmail,
  eventName,
  projectName,
  domain,
  teamSize,
  teamMembers,
}) => {
  const rows = [
    ['Event', eventName || 'Code-a-Nova Hackathon'],
    ['Project', projectName],
    ['Track', domain],
    ['Team size', `${teamSize} ${teamSize === 1 ? '(Solo)' : 'members'}`],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5e6370;width:32%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;font-size:14px;font-weight:600;color:#16181d;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');

  const everyone = [
    { name: participantName, email: participantEmail, lead: true },
    ...(teamMembers || []),
  ];

  const membersHtml = `
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #d9d4c6;">
      <div style="font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5e6370;margin-bottom:8px;">Team</div>
      <ul style="margin:0;padding-left:18px;color:#4a4f5a;font-size:13px;line-height:1.7;">
        ${everyone
          .map(
            (m) =>
              `<li><strong>${escapeHtml(m.name)}</strong>${m.lead ? ' (team lead)' : ''}${
                m.email ? ` &middot; ${escapeHtml(m.email)}` : ''
              }</li>`
          )
          .join('')}
      </ul>
    </div>`;

  const dashboardUrl = `${(process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim()}/dashboard`;

  return renderShell({
    title: 'Code-a-Nova Registration Confirmed',
    eyebrow: 'Registration confirmed',
    bodyHtml: `
      <h2 style="margin:0 0 12px;font-size:20px;color:#1f7a5c;">You&rsquo;re in, ${escapeHtml(participantName)}.</h2>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4a4f5a;">
        Your registration has been received and saved. Here are the details we have on record.
      </p>
      <div style="background-color:#f5f2ea;border:1px solid #d9d4c6;border-radius:10px;padding:20px;margin:0 0 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
        ${membersHtml}
      </div>
      <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#4a4f5a;">
        You can review your submission any time from your
        <a href="${escapeHtml(dashboardUrl)}" style="color:#d4410f;font-weight:600;">Code-a-Nova dashboard</a>.
      </p>
      <p style="margin:0;font-size:13px;color:#4a4f5a;">Good luck with the build,<br><strong>The Code-a-Nova Team</strong></p>`,
  });
};

/**
 * Shared send helper — supports HTTPS Webhook, Brevo REST API, Resend REST API,
 * and standard Nodemailer SMTP. Never throws unhandled errors.
 */
const deliver = async (mailOptions) => {
  const configured = isSmtpConfigured();

  // Mode 1: HTTPS Webhook (e.g. Google Apps Script Web App - bypasses cloud SMTP port blocks)
  if (process.env.EMAIL_WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.EMAIL_WEBHOOK_URL.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: mailOptions.to,
          subject: mailOptions.subject,
          html: mailOptions.html,
          text: mailOptions.text,
        }),
      });

      if (response.ok) {
        return {
          success: true,
          configured: true,
          messageId: `webhook-${Date.now()}`,
        };
      }

      const errText = await response.text();
      throw new Error(`Webhook error (${response.status}): ${errText}`);
    } catch (error) {
      console.error(`❌ [Email Webhook Delivery Error]: ${error.message}`);
      return { success: false, configured: true, error: error.message };
    }
  }

  // Mode 2: Brevo (Sendinblue) Transactional REST API over HTTPS port 443
  if (process.env.BREVO_API_KEY) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': process.env.BREVO_API_KEY.trim(),
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: SENDER_NAME,
            email:
              process.env.BREVO_SENDER_EMAIL?.trim() ||
              (process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : 'noreply@codeanova.com'),
          },
          to: [{ email: mailOptions.to }],
          subject: mailOptions.subject,
          htmlContent: mailOptions.html,
          textContent: mailOptions.text,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, configured: true, messageId: data.messageId };
      }
      throw new Error(data.message || `Brevo API error (${response.status})`);
    } catch (error) {
      console.error(`❌ [Brevo API Delivery Error]: ${error.message}`);
      return { success: false, configured: true, error: error.message };
    }
  }

  // Mode 3: Resend REST API over HTTPS port 443
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM || `${SENDER_NAME} <onboarding@resend.dev>`;
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [mailOptions.to],
          subject: mailOptions.subject,
          html: mailOptions.html,
          text: mailOptions.text,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, configured: true, messageId: data.id };
      }
      throw new Error(data.message || `Resend API error (${response.status})`);
    } catch (error) {
      console.error(`❌ [Resend API Delivery Error]: ${error.message}`);
      return { success: false, configured: true, error: error.message };
    }
  }

  // Mode 4: Standard Nodemailer (SMTP / direct connection)
  try {
    const info = await createTransporter().sendMail(mailOptions);
    return {
      success: true,
      configured,
      messageId: info.messageId,
      jsonOutput: !configured ? info.message : undefined,
    };
  } catch (error) {
    console.error(`❌ [Nodemailer Delivery Error]: ${error.message}`);
    return { success: false, configured, error: error.message };
  }
};

/**
 * Send 6-digit OTP verification email
 */
export const sendOTPEmail = async ({ to, recipientName, otp }) =>
  deliver({
    from: getSenderAddress(),
    to,
    subject: 'Code-a-Nova — Your account verification code',
    text: `Your Code-a-Nova verification code is: ${otp}. This code is valid for 10 minutes and can be used once.`,
    html: generateOTPEmailHTML(recipientName, otp),
  });

/**
 * Send Hackathon Registration Confirmation Email
 */
export const sendRegistrationConfirmationEmail = async ({
  to,
  participantName,
  participantEmail,
  projectName,
  domain,
  teamSize,
  teamMembers,
}) =>
  deliver({
    from: getSenderAddress(),
    to,
    subject: `Code-a-Nova Hackathon — Registration confirmed: ${projectName}`,
    text: `Hello ${participantName}, your registration for the Code-a-Nova Hackathon (track: ${domain}, project: ${projectName}) has been confirmed.`,
    html: generateConfirmationEmailHTML({
      participantName,
      participantEmail: participantEmail || to,
      eventName: 'Code-a-Nova Hackathon 2026',
      projectName,
      domain,
      teamSize,
      teamMembers,
    }),
  });

/**
 * Forward a contact-form inquiry to the project mailbox.
 * Reply-To is the visitor, so the organisers can answer directly.
 */
export const sendContactEmail = async ({ name, email, message }) => {
  const inbox = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
  return deliver({
    from: getSenderAddress(),
    to: inbox || 'noreply@localhost',
    replyTo: `"${String(name).replace(/["\r\n]/g, '')}" <${email}>`,
    subject: `Code-a-Nova contact form — message from ${String(name).replace(/[\r\n]/g, ' ')}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: renderShell({
      title: 'New contact form message',
      eyebrow: 'Contact form',
      bodyHtml: `
        <p style="margin:0 0 6px;font-size:13px;color:#5e6370;">From</p>
        <p style="margin:0 0 20px;font-size:15px;font-weight:600;">${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p style="margin:0 0 6px;font-size:13px;color:#5e6370;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#16181d;">${escapeHtml(message)}</p>`,
    }),
  });
};
