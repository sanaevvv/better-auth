import { sendEmail } from "./send-email"
import DeleteAccountVerificationTemplate from "./templates/delete-account-verification-template"

interface EmailVerificationData {
  user: {
    name: string
    email: string
  }
  url: string
}

export async function sendDeleteAccountVerificationEmail({
  user,
  url,
}: EmailVerificationData) {
  await sendEmail({
    to: user.email,
    subject: "アカウント削除を確認してください",
    react: DeleteAccountVerificationTemplate({ user, url }),
  })
}
