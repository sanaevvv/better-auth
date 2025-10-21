"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { NumberInput } from "@/components/ui/number-input"
import { useRouter } from "next/navigation"

const profileUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  favoriteNumber: z.number().int(),
})

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>

export function ProfileUpdateForm({
  user,
}: {
  user: {
    email: string
    name: string
    favoriteNumber: number
  }
}) {
  const router = useRouter()
  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  })

  const { isSubmitting } = form.formState

  async function handleProfileUpdate(data: ProfileUpdateForm) {
    const promises = [
      authClient.updateUser({
        name: data.name,
        favoriteNumber: data.favoriteNumber,
      }),
    ]

    //  条件チェックと配列への追加
    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "/profile",
        })
      )
    }

    const res = await Promise.all(promises)

    const updateUserResult = res[0]

    //  メール変更されない場合は {error:false} を返す
    const emailResult = res[1] ?? { error: false }

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || "プロフィールの更新に失敗しました")
    } else if (emailResult.error) {
      toast.error(emailResult.error.message || "メール変更に失敗しました")
    } else {
      if (data.email !== user.email) {
        toast.success("新しいメールアドレスを確認してください。")
      } else {
        toast.success("プロフィールの更新に成功しました")
      }
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleProfileUpdate)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="favoriteNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>好きな数字</FormLabel>
              <FormControl>
                <NumberInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>プロフィールを更新する</LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}
