"use client"

import { type ComponentProps, type ReactNode, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { LoadingSwap } from "@/components/ui/loading-swap"
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ActionButton({
  action,
  requireAreYouSure = false,
  areYouSureDescription = "この操作は元に戻せません。",
  ...props
}: ComponentProps<typeof Button> & {
  action: () => Promise<{ error: boolean; message?: string }>
  requireAreYouSure?: boolean
  areYouSureDescription?: ReactNode
}) {
  const [isLoading, startTransition] = useTransition()

  function performAction() {
    startTransition(async () => {
      // props で渡された action 関数を実行（整形済みの結果を取得）
      const data = await action()
      // エラーの場合
      if (data.error) {
        toast.error(data.message || "エラーが発生しました。")
      // 成功で message があれば成功メッセージを表示
      } else if (data.message) {
        toast.success(data.message)
      }
    })
  }

  if (requireAreYouSure) {
    return (
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に操作を取り消しますか?</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={performAction}>
              <LoadingSwap isLoading={isLoading}>はい</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Button
      {...props}
      disabled={props.disabled ?? isLoading}
      onClick={e => {
        performAction()
        props.onClick?.(e)
      }}
    >
      <LoadingSwap
        isLoading={isLoading}
        className="inline-flex items-center gap-2"
      >
        {props.children}
      </LoadingSwap>
    </Button>
  )
}
