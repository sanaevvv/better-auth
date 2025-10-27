import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InviteInformation } from "../_components/invite-information"
export default async function InvitationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session == null) return redirect("/auth/login")

  const { id } = await params

  // 組織への招待状の詳細情報を取得
  const invitation = await auth.api
    .getInvitation({
      headers: await headers(),
      query: { id }, // id に対応する招待状データを検索
    })
    .catch(() => redirect("/"))

  return (
    <div className="container mx-auto my-6 max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join the {invitation.organizationName}{" "}
            organization as a {invitation.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteInformation invitation={invitation} />
        </CardContent>
      </Card>
    </div>
  )
}
