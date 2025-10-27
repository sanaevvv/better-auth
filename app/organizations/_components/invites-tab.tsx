"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth/auth-client"
import BetterAuthActionButton from "@/components/auth/better-auth-action-button"
import { CreateInviteButton } from "./create-invite-button"

// 組織への招待管理機能のタブ
export function InvitesTab() {
  // 現在アクティブな組織の情報を取得
  const { data: activeOrganization } = authClient.useActiveOrganization()
  // 未承認の招待を取得
    const pendingInvites = activeOrganization?.invitations?.filter(
      invite => invite.status === "pending"
    )
  // 招待をキャンセルする関数
    function cancelInvitation(invitationId: string) {
      return authClient.organization.cancelInvitation({ invitationId })
    }

  return (
    <div className="space-y-4">
      <div className="justify-end flex">
        <CreateInviteButton />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingInvites?.map(invitation => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{invitation.role}</Badge>
              </TableCell>
              <TableCell>
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <BetterAuthActionButton
                  variant="destructive"
                  size="sm"
                  action={() => cancelInvitation(invitation.id)}
                >
                  Cancel
                </BetterAuthActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
