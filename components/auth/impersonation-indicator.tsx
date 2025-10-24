"use client"

import { authClient } from "@/lib/auth/auth-client"
import { UserX } from "lucide-react"
import BetterAuthActionButton from "./better-auth-action-button"
import { useRouter } from "next/navigation"

export function ImpersonationIndicator() {
  const router = useRouter()
  const { data: session, refetch } = authClient.useSession()

  // なりすまし中の場合、impersonatedBy に管理者のIDが入る
  if (session?.session.impersonatedBy == null) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <BetterAuthActionButton
        action={() =>
          // なりすましを解除
          authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              router.push("/admin")
              refetch()
            },
          })
        }
        variant="destructive"
        size="sm"
      >
        <UserX className="size-4" />
      </BetterAuthActionButton>
    </div>
  )
}
