// src/email/email.service.ts

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // or your SMTP host
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });
  }

  async sendOtpEmail(to: string, otpCode: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"E-Market Platform" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your One-Time Password (OTP) for E-Market Platform',
        text: `Hello,

Your One-Time Password (OTP) for completing your action on E-Market Platform is:

${otpCode}

This code is valid for 10 minutes.

If you did not request this, please ignore this email or contact support at support@yourdomain.com.

Thank you,
E-Market Platform Team
`,
        // HTML email (table-based for best client support)
        html: `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      /* Reset & base */
      body { margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color:#333333; }
      a { color: #2563EB; text-decoration: none; }
      img { border: none; display: block; }

      /* Container */
      .email-wrap { width:100%; background:#f4f6f8; padding:24px 0; }
      .email-container { width:100%; max-width:680px; margin:0 auto; background:#ffffff; border-radius:8px; box-shadow:0 6px 18px rgba(15,23,42,0.06); overflow:hidden; }

      /* Header */
      .header { padding:20px 28px; display:flex; align-items:center; gap:12px; }
      .brand-logo { width:44px; height:44px; border-radius:8px; background:linear-gradient(135deg,#2563EB,#7C3AED); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; }
      .brand-title { font-size:18px; font-weight:700; color:#0f172a; }

      /* Body */
      .content { padding:28px; }
      .preheader { display:none !important; visibility:hidden; mso-hide:all; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; }
      .h1 { font-size:20px; font-weight:700; margin:0 0 8px; color:#0f172a; }
      .lead { margin:0 0 20px; color:#475569; font-size:15px; line-height:1.55; }

      /* OTP box */
      .otp-box { margin: 20px 0; padding:20px; background:linear-gradient(90deg, rgba(37,99,235,0.06), rgba(124,58,237,0.04)); border:1px solid rgba(15,23,42,0.04); border-radius:8px; display:flex; align-items:center; justify-content:center; }
      .otp-code { font-family: 'Courier New', Courier, monospace; font-size:32px; letter-spacing:6px; font-weight:700; color:#0f172a; background:#ffffff; padding:8px 18px; border-radius:6px; box-shadow: inset 0 -1px 0 rgba(0,0,0,0.02); }

      .note { margin-top:14px; color:#64748b; font-size:13px; }

      /* Footer */
      .footer { background:#fafafa; padding:18px 28px; font-size:13px; color:#94a3b8; border-top:1px solid #eef2f7; }
      .footer a { color:#64748b; text-decoration:underline; }

      /* Button (fallback for clients that support it) */
      .cta { display:inline-block; background:#2563EB; color:#fff; padding:12px 20px; border-radius:8px; font-weight:600; text-decoration:none; margin-top:12px; }

      /* Responsive tweaks */
      @media (max-width:480px) {
        .content { padding:18px; }
        .header { padding:16px 18px; }
        .brand-title { font-size:16px; }
        .otp-code { font-size:26px; letter-spacing:4px; padding:6px 12px; }
      }
    </style>
  </head>

  <body>
    <span class="preheader">Your OTP for E-Market Platform is ${otpCode} — valid for 10 minutes.</span>

    <table role="presentation" class="email-wrap" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" class="email-container" cellpadding="0" cellspacing="0">
            <!-- Header -->
            <tr>
              <td class="header">
            
                <div>
                  <div class="brand-title">E-Market Platform</div>
                  <div style="font-size:12px; color:#94a3b8;">Secure marketplace for agri-products</div>
                </div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td class="content">
                <h1 class="h1">One-Time Password (OTP)</h1>
                <p class="lead">Hi there,</p>
                <p class="lead">Use the OTP below to complete your action on <strong>E-Market Platform</strong>. This code is time-sensitive for your security.</p>

                <div class="otp-box" role="presentation" aria-hidden="true">
                  <div class="otp-code" aria-label="One time password">${otpCode}</div>
                </div>

                <p class="note">This code is valid for <strong>30 minutes</strong>. If you didn't request this, please ignore this email or <a href="mailto:support@yourdomain.com">contact support</a> immediately.</p>

                <!-- Optional CTA (copy-to-clipboard link could be implemented on client side) -->
                

                <p style="margin-top:20px; color:#475569; font-size:14px;">Thanks,<br/>E-Market Platform Team</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer">
                <div>If you need help, contact <a href="mailto:support@yourdomain.com">support@yourdomain.com</a> or visit our <a href="https://yourdomain.com/help">Help Center</a>.</div>
                <div style="margin-top:8px;">© ${new Date().getFullYear()} E-Market Platform. All rights reserved.</div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
      });
    } catch (error) {
      throw error;
    }
  }
}
