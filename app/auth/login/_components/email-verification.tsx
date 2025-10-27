"use client"

import BetterAuthActionButton from "@/components/auth/better-auth-action-button"
import { authClient } from "@/lib/auth/auth-client"
import { useEffect, useRef, useState } from "react"

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30)

  //  タイマーIDを保存するためのref
  const interval = useRef<NodeJS.Timeout>(undefined)

  // マウント時にメール再送信のタイマーを開始
  useEffect(() => {
    startEmailVerificationCountdown()
  }, [])

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time)

    // 既存のタイマーがあればクリア（重複実行を防ぐ）
    clearInterval(interval.current)

    // 1秒ごとにカウントダウンを実行するタイマーを開始
    interval.current = setInterval(() => {
      setTimeToNextResend(prevT => {
        const newT = prevT - 1

        if (newT <= 0) {
          clearInterval(interval.current)
          return 0
        }
        return newT
      })
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        メールアドレスを確認するためのリンクを送信しました。メールを確認してください。
      </p>

      {/* メール再送信ボタンクリック時 */}
      <BetterAuthActionButton
        variant="outline"
        className="w-full"
        successMessage="確認メールを送信しました!"
        disabled={timeToNextResend > 0}
        action={() => {
          startEmailVerificationCountdown()
          return authClient.sendVerificationEmail({
            email,
            callbackURL: "/",
          })
        }}
      >
        {timeToNextResend > 0
          ? `Resend Email (${timeToNextResend})`
          : "Resend Email"}
      </BetterAuthActionButton>
    </div>
  )
}
