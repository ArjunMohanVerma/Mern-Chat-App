import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk"; //I am using brevo here for mail sending service as the sandgrid is expired now...

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

dotenv.config();

/* ===============================
   BREVO CONFIG
================================= */

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();

/* ===============================
   VERIFY EMAIL
================================= */
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transactionalApi.sendTransacEmail({
      sender: { email: process.env.FROM_EMAIL, name: "Auth Company" },
      to: [{ email }],
      subject: "Verify your email",
      htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    console.log("Verification email sent:", response.messageId);
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
  try {
    const response = await transactionalApi.sendTransacEmail({
      sender: { email: process.env.FROM_EMAIL, name: "Auth Company" },
      to: [{ email }],
      subject: "Welcome to Chatty-Chat 🎉",
      htmlContent: `
        <h2>Welcome ${name}!</h2>
        <p>Your account has been verified.</p>
      `,
    });

    console.log("Welcome email sent:", response.messageId);
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
  try {
    const response = await transactionalApi.sendTransacEmail({
      sender: { email: process.env.FROM_EMAIL, name: "Auth Company" },
      to: [{ email }],
      subject: "Reset your password",
      htmlContent: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        resetURL
      ),
    });

    console.log("Password reset email sent:", response.messageId);
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
  try {
    const response = await transactionalApi.sendTransacEmail({
      sender: { email: process.env.FROM_EMAIL, name: "Auth Company" },
      to: [{ email }],
      subject: "Password Reset Successful",
      htmlContent: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Password reset success email sent:", response.messageId);
  } catch (error) {
    console.error(
      "Error sending password reset success email:",
      error.response?.body || error.message
    );
    throw new Error("Error sending password reset success email");
  }
};