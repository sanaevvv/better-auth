import React from "react"
import { sendEmail } from "./send-email"
import WelcomeEmailTemplate from "./templates/welcome-email-template"

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  await sendEmail({
    to: user.email,
    subject: "ご登録ありがとうございます",
    react: WelcomeEmailTemplate({ user }),
  })
}
