"use client"

import BetterAuthActionButton from "@/components/auth/better-auth-action-button"
import { authClient } from "@/lib/auth/auth-client"

export function SetPasswordButton({ email }: { email: string }) {
  return (
    <BetterAuthActionButton
      variant="outline"
      successMessage="パスワードリセットメールを送信しました"
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        })
      }}
    >
      パスワードリセットメールを送信
    </BetterAuthActionButton>
  )
}
