import React from "react";
import { sendEmail } from "./send-email";
import EmailVerificationTemplate from "./templates/email-verification-template";

interface EmailVerificationData {
  user: {
    name: string;
    email: string;
  };
  url: string;
}

const sendEmailVerificationEmail = async ({ user, url }: EmailVerificationData) => {
  return await sendEmail({
    to: user.email,
    subject: "Verify your email address",
    react: <EmailVerificationTemplate user={user} url={url} />
  });
};

export default sendEmailVerificationEmail;
