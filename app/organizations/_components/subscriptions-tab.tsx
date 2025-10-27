"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { useEffect, useState } from "react"
import { Subscription } from "@better-auth/stripe"
import { toast } from "sonner"
import { PLAN_TO_PRICE, STRIPE_PLANS } from "@/lib/auth/stripe"
import BetterAuthActionButton from "@/components/auth/better-auth-action-button"

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
})

export function SubscriptionsTab() {
  // ユーザーが現在選択中の組織データを取得
  const { data: activeOrganization } = authClient.useActiveOrganization()
  // サブスクリプション一覧を管理する状態
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  // 組織が変更されたらサブスクリプション一覧を更新
  useEffect(() => {
    if (activeOrganization == null) {
      return setSubscriptions([])
    }

    // 組織IDを指定してサブスクリプション一覧取得（defaultではuserIdに紐づけられてしまうため、referenceIdを指定する必要がある）
    authClient.subscription
      .list({ query: { referenceId: activeOrganization.id } })
      .then(result => {
        if (result.error) {
          setSubscriptions([])
          toast.error("Failed to load subscriptions")
          return
        }

        setSubscriptions(result.data)
      })
  }, [activeOrganization])

  // アクティブなサブスクリプションを探す
  const activeSubscription = subscriptions.find(
    sub => sub.status === "active" || sub.status === "trialing"
  )

  // そのサブスクリプションがどのプランに該当するかを探す
  const activePlan = STRIPE_PLANS.find(
    plan => plan.name === activeSubscription?.plan
  )

  async function handleBillingPortal() {
    // 組織未選択時は即エラーを返す
    if (activeOrganization == null) {
      return { error: { message: "No active organization" } }
    }

    // 請求ポータルのセッションURLを生成
    const res = await authClient.subscription.billingPortal({
      referenceId: activeOrganization.id, // この組織に紐づくサブスクリプションのみを表示
      returnUrl: window.location.href, // ユーザーがポータルでの操作を終えた後の戻り先URL(現在のURL)②
    })

    if (res.error == null) {
      window.location.href = res.data.url  // ポータルへ移動するURL①
    }

    return res
  }

  // サブスクリプションキャンセル
  function handleCancelSubscription() {
    // 組織未選択時は即エラーを返す
    if (activeOrganization == null) {
      // 戻り値の型統一のためにPromise.resolve()で包む
      return Promise.resolve({ error: { message: "No active organization" } })
    }

    // 対象サブスクリプションがない場合も即エラーを返す
    if (activeSubscription == null) {
      // 戻り値の型統一のためにPromise.resolve()で包む
      return Promise.resolve({ error: { message: "No active subscription" } })
    }

    // サブスクリプションキャンセル実行(Promiseを返す)
    return authClient.subscription.cancel({
      // キャンセル対象のサブスクリプションIDを指定
      subscriptionId: activeSubscription.id,
      // どの組織のサブスクリプションかを識別
      referenceId: activeOrganization.id,
      // キャンセル完了後のリダイレクト先URL（現在のページ）
      returnUrl: window.location.href,
    })
  }

  // 選択したプランへサブスクリプションのアップグレード/変更/新規購入
  function handleSubscriptionChange(plan: string) {
    // アクティブな組織がない場合、エラー
    if (activeOrganization == null) {
      return Promise.resolve({ error: { message: "No active organization" } })
    }

    return authClient.subscription.upgrade({
      plan,  // 新しいプラン名
      subscriptionId: activeSubscription?.id, // 現在のサブスクリプションID
      referenceId: activeOrganization.id, // 現在の組織ID
      returnUrl: window.location.href,  // 決済完了後のリダイレクト先
      successUrl: window.location.href, // 成功時のリダイレクト先
      cancelUrl: window.location.href,  // キャンセル時のリダイレクト先
    })
  }

  return (
    <div className="space-y-6">
      {activeSubscription && activePlan && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold capitalize">
                    {activeSubscription.plan} Plan
                  </h3>
                  {activeSubscription.priceId && (
                    <Badge variant="secondary">
                      {currencyFormatter.format(
                        PLAN_TO_PRICE[activeSubscription.plan]
                      )}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activePlan.limits.projects} projects included
                </p>
                {activeSubscription.periodEnd && (
                  <p className="text-sm text-muted-foreground">
                    {activeSubscription.cancelAtPeriodEnd
                      ? "Cancels on "
                      : "Renews on "}
                    {activeSubscription.periodEnd.toLocaleDateString()}
                  </p>
                )}
              </div>
              <BetterAuthActionButton
                variant="outline"
                action={handleBillingPortal}
                className="flex items-center gap-2"
              >
                Billing Portal
              </BetterAuthActionButton>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {STRIPE_PLANS.map(plan => (
          <Card key={plan.name} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl capitalize">
                  {plan.name}
                </CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {currencyFormatter.format(PLAN_TO_PRICE[plan.name])}
                  </div>
                </div>
              </div>
              <CardDescription>
                Up to {plan.limits.projects} projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeSubscription?.plan === plan.name ? (
                activeSubscription.cancelAtPeriodEnd ? (
                  <Button disabled variant="outline" className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <BetterAuthActionButton
                    variant="destructive"
                    className="w-full"
                    action={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </BetterAuthActionButton>
                )
              ) : (
                <BetterAuthActionButton
                  action={() => handleSubscriptionChange(plan.name)}
                  className="w-full"
                >
                  {activeSubscription == null ? "Subscribe" : "Change Plan"}
                </BetterAuthActionButton>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
