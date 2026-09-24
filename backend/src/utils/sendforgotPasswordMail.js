

import { sendMail } from "./sendMail.js";

export const sendForgotPasswordMail = async ({
  email,
  firstname,
  resetUrl,
}) => {
  try {
    await sendMail({
      to: email,
      subject: "Reset Your Password - Service Support System",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          "
        >
          <h2>Reset Your Password</h2>

          <p>
            Hello ${firstname},
          </p>

          <p>
            We received a request to reset the password for your
            Service Support System account.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetUrl}"
              style="
                background: #2563eb;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
              "
            >
              Reset Your Password
            </a>
          </div>

          <p>
            This password reset link will expire in
            <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely
            ignore this email.
          </p>

          <p>
            For security reasons, this link can only be used once.
          </p>

          <p>
            Regards,<br />
            Service Support System
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.log("sendForgotPasswordMail error:", error);
    throw error;
  }
};