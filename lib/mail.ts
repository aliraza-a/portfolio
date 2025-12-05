// src/lib/mail.ts
import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const accessToken = await new Promise<string>((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.error("Failed to get access token:", err);
        reject(err);
      }
      resolve(token || "");
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      accessToken,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  return transporter;
};

interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async (options: SendMailOptions) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `Ali Raza Portfolio <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export const sendContactNotification = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const notificationEmail =
    process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { margin-top: 5px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
        .message-box { white-space: pre-wrap; }
        .reply-btn { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">📬 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">You have received a new message from your portfolio website.</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">From</div>
            <div class="value"><strong>${data.name}</strong> &lt;${
    data.email
  }&gt;</div>
          </div>
          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${data.subject}</div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="value message-box">${data.message}</div>
          </div>
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(
    data.subject
  )}" class="reply-btn">
            Reply to ${data.name}
          </a>
        </div>
        <div class="footer">
          <p>This email was sent from your portfolio contact form.</p>
          <p>© ${new Date().getFullYear()} Ali Raza. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Contact Form Submission

From: ${data.name} <${data.email}>
Subject: ${data.subject}

Message:
${data.message}

---
Reply to this message by emailing ${data.email}
  `;

  return sendMail({
    to: notificationEmail!,
    subject: `[Portfolio] New message from ${data.name}: ${data.subject}`,
    text,
    html,
  });
};

export const sendAutoReply = async (data: {
  name: string;
  email: string;
  subject: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px; }
        .social-links { margin-top: 15px; }
        .social-links a { color: #9ca3af; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Thank You! 🙏</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your message has been received.</p>
        </div>
        <div class="content">
          <p>Hi <strong>${data.name}</strong>,</p>
          <p>Thank you for reaching out! I've received your message regarding "<strong>${
            data.subject
          }</strong>" and will get back to you as soon as possible, usually within 24-48 hours.</p>
          <p>In the meantime, feel free to check out my latest projects on my portfolio or connect with me on LinkedIn.</p>
          <p>Best regards,<br><strong>Ali Raza</strong><br>Web Developer & Head of Production</p>
        </div>
        <div class="footer">
          <p>Ali Raza - Web Developer</p>
          <div class="social-links">
            <a href="https://linkedin.com/in/a1irazaaa">LinkedIn</a> |
            <a href="mailto:razaa8075@gmail.com">Email</a>
          </div>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} Ali Raza. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hi ${data.name},

Thank you for reaching out! I've received your message regarding "${data.subject}" and will get back to you as soon as possible, usually within 24-48 hours.

In the meantime, feel free to check out my latest projects on my portfolio or connect with me on LinkedIn.

Best regards,
Ali Raza
Web Developer & Head of Production
  `;

  return sendMail({
    to: data.email,
    subject: `Thanks for reaching out, ${data.name}!`,
    text,
    html,
  });
};
