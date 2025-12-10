const nodemailer = require("nodemailer");

const sendEmail = async (email, otp, type = "signup") => {
  const transporter = nodemailer.createTransport({
    host: process.env.AUTH_EMAIL,
    service: "gmail",
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  // Dynamic content based on type
  const emailContent = {
    signup: {
      subject: "Welcome to Pick & Go - Verify Your Email ✨",
      title: "Welcome to Pick & Go!",
      greeting: "Hi there,",
      message:
        "Thank you for joining Pick & Go! We're excited to have you on board. Use the following OTP to verify your email and complete your registration.",
      actionText: "This OTP is valid for 5 minutes.",
      footer: "If you didn't create an account, please ignore this email.",
    },
    reset: {
      subject: "Pick & Go - Password Reset Request 🔐",
      title: "Reset Your Password",
      greeting: "Hello,",
      message:
        "We received a request to reset your password for your Pick & Go account. Use the following OTP to proceed with resetting your password.",
      actionText: "This OTP is valid for 10 minutes.",
      footer:
        "If you didn't request a password reset, please ignore this email and your password will remain unchanged.",
    },
  };

  const content = emailContent[type] || emailContent.signup;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); display: inline-block; padding: 12px 24px; border-radius: 50px; margin-bottom: 20px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                      Pick & Go
                    </h1>
                  </div>
                  <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                    ${content.title}
                  </h2>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                    ${content.greeting}
                  </p>
                  <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">
                    ${content.message}
                  </p>

                  <!-- OTP Box -->
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="margin: 0 0 10px; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                      Your OTP Code
                    </p>
                    <div style="background: #ffffff; border-radius: 8px; padding: 20px; display: inline-block; margin: 10px 0;">
                      <h1 style="margin: 0; color: #667eea; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${otp}
                      </h1>
                    </div>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.8); font-size: 13px;">
                      ${content.actionText}
                    </p>
                  </div>

                  <!-- Info Box -->
                  <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px 20px; border-radius: 4px; margin: 30px 0;">
                    <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6;">
                      <strong style="color: #333333;">Security Tip:</strong> Never share this OTP with anyone. Pick & Go will never ask for your OTP via phone or email.
                    </p>
                  </div>

                  <p style="margin: 30px 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                    ${content.footer}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px; color: #333333; font-size: 15px; font-weight: 600;">
                    Pick & Go
                  </p>
                  <p style="margin: 0 0 5px; color: #666666; font-size: 13px;">
                    Your trusted e-commerce partner
                  </p>
                  <p style="margin: 0 0 15px; color: #999999; font-size: 12px;">
                  Dhaka, Bangladesh
                  </p>
             

                  <p style="margin: 15px 0 0; color: #999999; font-size: 11px;">
                    © 2025 Pick & Go Inc. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: '"Pick & Go" <abrarjahinayat123@gmail.com>',
    to: email,
    subject: content.subject,
    html: htmlTemplate,
  });

  return info;
};

module.exports = sendEmail;
