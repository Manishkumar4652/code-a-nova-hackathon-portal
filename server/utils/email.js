import nodemailer from 'nodemailer';

/**
 * Check if SMTP credentials are configured in environment
 */
export const isSmtpConfigured = () => {
  return Boolean(
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_USER.trim() !== '' &&
    process.env.EMAIL_PASS.trim() !== ''
  );
};

/**
 * Create Nodemailer transporter based on environment configuration
 */
export const createTransporter = () => {
  if (isSmtpConfigured()) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Fallback to jsonTransport for local testing without fake credentials
  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

/**
 * Generate standard HTML template for OTP verification
 * @param {string} recipientName
 * @param {string} otp
 */
export const generateOTPEmailHTML = (recipientName, otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code-a-Nova Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #38bdf8; letter-spacing: 0.5px;">Code-a-Nova</h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Hackathon Registration Portal</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #f8fafc;">Verify Your Email Address</h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Hello <strong>${recipientName || 'Participant'}</strong>,<br>
                Thank you for registering for the Code-a-Nova Hackathon. Please use the 6-digit one-time password (OTP) below to complete your registration.
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #020617; border: 1px solid #38bdf8; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="margin: 0 0 8px; font-size: 13px; color: #f59e0b; font-weight: 500;">
                ⏱️ This code will expire in exactly 10 minutes.
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                If you did not initiate this registration, please ignore this email. Do not share this OTP with anyone.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #090d16; text-align: center; border-top: 1px solid #1e293b;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                &copy; ${new Date().getFullYear()} Code-a-Nova. All rights reserved.
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
};

/**
 * Generate standard HTML template for Hackathon Registration Confirmation
 * @param {Object} details
 */
export const generateConfirmationEmailHTML = ({ participantName, eventName, projectName, domain, teamSize, teamMembers }) => {
  const membersHtml = teamMembers && teamMembers.length > 0
    ? `
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #334155;">
        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #94a3b8;">Additional Team Members:</p>
        <ul style="margin: 0; padding-left: 18px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
          ${teamMembers.map(m => `<li><strong>${m.name}</strong> (${m.email})</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code-a-Nova Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #38bdf8; letter-spacing: 0.5px;">Code-a-Nova</h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #a5b4fc; text-transform: uppercase; letter-spacing: 1px;">Official Registration Confirmation</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #10b981;">🎉 Registration Confirmed!</h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Hello <strong>${participantName}</strong>,<br>
                Congratulations! Your registration for the <strong>${eventName || 'Code-a-Nova Hackathon'}</strong> has been successfully received and recorded in our system.
              </p>
              
              <!-- Details Card -->
              <div style="background-color: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 0 0 24px;">
                <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 13px; color: #cbd5e1;">
                  <tr>
                    <td style="color: #94a3b8; width: 35%;">Project Name:</td>
                    <td style="font-weight: 600; color: #f8fafc;">${projectName}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Domain / Track:</td>
                    <td style="font-weight: 600; color: #38bdf8;">${domain}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8;">Team Size:</td>
                    <td style="font-weight: 600; color: #f8fafc;">${teamSize} ${teamSize === 1 ? '(Solo)' : 'Members'}</td>
                  </tr>
                </table>
                ${membersHtml}
              </div>
              
              <p style="margin: 0 0 16px; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
                You can view and verify your submission anytime by logging into your <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="color: #38bdf8; text-decoration: underline;">Code-a-Nova Dashboard</a>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                Best of luck with your hackathon build!<br>
                <strong>The Code-a-Nova Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #090d16; text-align: center; border-top: 1px solid #1e293b;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                &copy; ${new Date().getFullYear()} Code-a-Nova. All rights reserved.
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
};

/**
 * Send 6-digit OTP verification email
 */
export const sendOTPEmail = async ({ to, recipientName, otp }) => {
  const configured = isSmtpConfigured();
  const transporter = createTransporter();

  const senderAddress = configured && process.env.EMAIL_USER
    ? `"Code-a-Nova" <${process.env.EMAIL_USER}>`
    : `"Code-a-Nova" <noreply@codeanova.com>`;

  const mailOptions = {
    from: senderAddress,
    to,
    subject: 'Code-a-Nova — Your Account Verification Code',
    text: `Your Code-a-Nova verification code is: ${otp}. This code is valid for 10 minutes.`,
    html: generateOTPEmailHTML(recipientName, otp),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      configured,
      messageId: info.messageId,
      jsonOutput: !configured ? info.message : undefined,
    };
  } catch (error) {
    console.error(`❌ [Nodemailer Delivery Error]: ${error.message}`);
    return {
      success: false,
      configured,
      error: error.message,
    };
  }
};

/**
 * Send Hackathon Registration Confirmation Email
 */
export const sendRegistrationConfirmationEmail = async ({ to, participantName, projectName, domain, teamSize, teamMembers }) => {
  const configured = isSmtpConfigured();
  const transporter = createTransporter();

  const senderAddress = configured && process.env.EMAIL_USER
    ? `"Code-a-Nova" <${process.env.EMAIL_USER}>`
    : `"Code-a-Nova" <noreply@codeanova.com>`;

  const mailOptions = {
    from: senderAddress,
    to,
    subject: `Code-a-Nova Hackathon — Registration Confirmed: ${projectName}`,
    text: `Hello ${participantName}, your registration for Code-a-Nova Hackathon under domain ${domain} has been successfully confirmed.`,
    html: generateConfirmationEmailHTML({
      participantName,
      eventName: 'Code-a-Nova Hackathon 2026',
      projectName,
      domain,
      teamSize,
      teamMembers,
    }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      configured,
      messageId: info.messageId,
      jsonOutput: !configured ? info.message : undefined,
    };
  } catch (error) {
    console.error(`❌ [Nodemailer Delivery Error]: ${error.message}`);
    return {
      success: false,
      configured,
      error: error.message,
    };
  }
};
