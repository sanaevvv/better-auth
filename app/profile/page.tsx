import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Key,
  LinkIcon,
  Loader2Icon,
  Shield,
  Trash2,
  User,
} from "lucide-react"
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProfileUpdateForm } from './_components/profile_update_form'
import { ReactNode, Suspense } from 'react'
import { SetPasswordButton } from './_components/set_password_button'
import { ChangePasswordForm } from './_components/change-password-form'
import { SessionManagement } from './_components/session-management'
import { AccountLinking } from './_components/account-linking'
import { AccountDeletion } from './_components/account-deletion'
import { TwoFactorAuth } from './_components/two-factor-auth'
import { PasskeyManagement } from './_components/passkey-management'


const ProfilePage =async() => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session == null) return redirect("/auth/login")

  return (
     <div className="max-w-4xl mx-auto my-6 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center mb-6">
          <ArrowLeft className="size-4 mr-2" />
          ホームへ戻る
        </Link>
        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt="User Avatar"
                className="object-cover"
              />
            ) : (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 justify-between items-start">
              <h1 className="text-3xl font-bold">
                {session.user.name || "User Profile"}
              </h1>
              <Badge>{session.user.role}</Badge>
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User />
            <span className="max-sm:hidden">プロフィール</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield />
            <span className="max-sm:hidden">セキュリティー</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Key />
            <span className="max-sm:hidden">セッション</span>
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <LinkIcon />
            <span className="max-sm:hidden">アカウント</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <Trash2 />
            <span className="max-sm:hidden">危険な操作</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              <ProfileUpdateForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <LoadingSuspense>
            <SecurityTab
              email={session.user.email}
              isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
            />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="sessions">
          <LoadingSuspense>
            <SessionsTab currentSessionToken={session.session.token} />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="accounts">
          <LoadingSuspense>
            <LinkedAccountsTab />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDeletion />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage

async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string
}) {
  const sessions = await auth.api.listSessions({ headers: await headers() })

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  )
}

async function LinkedAccountsTab() {
  const accounts = await auth.api.listUserAccounts({ headers: await headers() })
  const nonCredentialAccounts = accounts.filter(
    a => a.providerId !== "credential"
  )

  return (
    <Card>
      <CardContent>
        <AccountLinking currentAccounts={nonCredentialAccounts} />
      </CardContent>
    </Card>
  )
}

async function SecurityTab({
  email,
  isTwoFactorEnabled,
}: {
  email: string
 isTwoFactorEnabled: boolean
}) {
  const [passkeys, accounts] = await Promise.all([
    auth.api.listPasskeys({ headers: await headers() }),
    // ユーザーが連携しているOAuthアカウント情報一覧を取得
    auth.api.listUserAccounts({ headers: await headers() }),
  ])

  const hasPasswordAccount = accounts.some(a => a.providerId === "credential")

  return (
    <div className="space-y-6">
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>パスワード変更</CardTitle>
            <CardDescription>
              セキュリティを向上させるためにパスワードを変更してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>パスワード設定</CardTitle>
            <CardDescription>
              パスワードを設定するためにメールを送信します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={email} />
          </CardContent>
        </Card>
      )}
      {hasPasswordAccount && (
        <Card>
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle>2段階認証</CardTitle>
            <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
              {isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardHeader>
          <CardContent>
            <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>パスキー管理</CardTitle>
        </CardHeader>
        <CardContent>
          <PasskeyManagement passkeys={passkeys} />
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
      {children}
    </Suspense>
  )
}
