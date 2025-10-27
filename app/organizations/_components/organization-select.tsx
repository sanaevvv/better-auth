"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"

export function OrganizationSelect() {
  // 現在アクティブな組織の情報を取得
  const { data: activeOrganization } = authClient.useActiveOrganization()
  // ユーザーが所属する全組織の一覧を取得
  const { data: organizations } = authClient.useListOrganizations()

  // 組織が存在しない場合は何も表示しない
  if (organizations == null || organizations.length === 0) {
    return null
  }

  function setActiveOrganization(organizationId: string) {
    authClient.organization.setActive(
      { organizationId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to switch organization")
        },
      }
    )
  }

  return (
    <Select
      value={activeOrganization?.id ?? ""}
      onValueChange={setActiveOrganization}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map(org => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
