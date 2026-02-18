import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* ===============================
   VERIFY EMAIL
================================= */
export const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Verify your email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Verification email sent:", response[0].statusCode);
  } catch (error) {
    console.error(
      "Error sending verification email:",
      error.response?.body || error.message
    );
    throw new Error("Error sending verification email");
  }
};

/* ===============================
   WELCOME EMAIL
================================= */
export const sendWelcomeEmail = async (email, name) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Welcome to Auth Company 🎉",
    html: `
      <h2>Welcome ${name}!</h2>
      <p>We're excited to have you at Auth Company.</p>
      <p>Your account has been successfully verified.</p>
    `,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Welcome email sent:", response[0].statusCode);
  } catch (error) {
    console.error(
      "Error sending welcome email:",
      error.response?.body || error.message
    );
    throw new Error("Error sending welcome email");
  }
};

/* ===============================
   PASSWORD RESET REQUEST
================================= */
export const sendPasswordResetEmail = async (email, resetURL) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Reset your password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Password reset email sent:", response[0].statusCode);
  } catch (error) {
    console.error(
      "Error sending password reset email:",
      error.response?.body || error.message
    );
    throw new Error("Error sending password reset email");
  }
};

/* ===============================
   PASSWORD RESET SUCCESS
================================= */
export const sendResetSuccessEmail = async (email) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Password Reset Successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Password reset success email sent:", response[0].statusCode);
  } catch (error) {
    console.error(
      "Error sending password reset success email:",
      error.response?.body || error.message
    );
    throw new Error("Error sending password reset success email");
  }
};
