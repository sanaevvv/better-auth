"use client"

import BetterAuthActionButton from "@/components/auth/better-auth-action-button"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"

// ユーザーが組織への招待を承認する処理
export function InviteInformation({
  invitation,
}: {
  invitation: { id: string; organizationId: string }
}) {
  const router = useRouter()

  function acceptInvite() {
    // サーバーサイドで招待状が承認
    return authClient.organization.acceptInvitation(
      { invitationId: invitation.id },
      {
        // 承認された組織をユーザーのアクティブな組織として設定
        onSuccess: async () => {
          await authClient.organization.setActive({
            organizationId: invitation.organizationId,
          })
          router.push("/organizations")
        },
      }
    )
  }

  // 招待を拒否する機能
  function rejectInvite() {
    return authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id,
      },
      { onSuccess: () => router.push("/") }
    )
  }

  return (
    <div className="flex gap-4">
      <BetterAuthActionButton className="flex-grow" action={acceptInvite}>
        Accept
      </BetterAuthActionButton>
      <BetterAuthActionButton
        className="flex-grow"
        variant="destructive"
        action={rejectInvite}
      >
        Reject
      </BetterAuthActionButton>
    </div>
  )
}
