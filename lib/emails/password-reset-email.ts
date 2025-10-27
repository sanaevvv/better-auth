import { sendEmail } from "./send-email";
import PasswordResetEmailTemplate from "./templates/password-reset-email-template";

export async function sendPasswordResetEmail({
  user,
  url,
}: {
  user: {
    name: string;
    email: string;
  };
  url: string;
}) {
  return await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    react: PasswordResetEmailTemplate({ user, url })
  });
}
