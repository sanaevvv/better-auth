"use client"

import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending: loading } = authClient.useSession();

  if (loading) return <div>Loading...</div>;

  return (

    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {session == null ? (
          <>
            <h1 className="text-3xl font-bold">Welcome to our Application</h1>

            <Button asChild size="lg">
              <Link href="/auth/login">
                ログイン / 新規登録
              </Link>
            </Button>
          </>) :
          <>
            <h1 className="text-3xl font-bold">ようこそ {session.user?.name}さん！</h1>

            <BetterAuthActionButton
              size="lg"
              variant="destructive"
              action={() => authClient.signOut()}
            >
              ログアウト
            </BetterAuthActionButton>
            </>

          }
      </div>
    </div>
  );
}
