import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import SignUpTab from "./_components/sign-up-tab";
import SignInTab from "./_components/sign-in-tab";

export default function LoginPage() {
  return <Tabs defaultValue="signin" className="max-w-auto my-6 px-4">
 <TabsList>
          <TabsTrigger value="signin">ログイン</TabsTrigger>
          <TabsTrigger value="signup">新規登録</TabsTrigger>
    </TabsList>
      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl">
            <CardTitle>ログイン</CardTitle>
          </CardHeader>
        <CardContent>
          {/* ログインフォームをここに配置 */}
            <SignInTab
              // openEmailVerificationTab={openEmailVerificationTab}
              // openForgotPassword={() => setSelectedTab("forgot-password")}
            />
          </CardContent>

          <Separator />
{/*
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter> */}
        </Card>
    </TabsContent>

     <TabsContent value="signup">
        <Card>
          <CardHeader className="text-2xl">
            <CardTitle>新規登録</CardTitle>
          </CardHeader>
        <CardContent>
          {/* 新規登録フォームをここに配置 */}
          <SignUpTab
            // penEmailVerificationTab={openEmailVerificationTab}
          />
          </CardContent>

          <Separator />

          {/* <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter> */}
        </Card>
      </TabsContent>
  </Tabs>
}
