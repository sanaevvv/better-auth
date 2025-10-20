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
import { PasswordInput } from "@/components/ui/password-input"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const signInSchema = z.object({
  email: z.email().min(1, { message: "必須です" }),
  password: z.string().min(6, { message: "6文字以上で入力してください" }),
})

type SignInForm = z.infer<typeof signInSchema>

const SignInTab = ({
  openEmailVerificationTab,
  openForgotPassword
}: {
  openEmailVerificationTab: (email: string) => void,
  openForgotPassword: () => void
}) => {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { isSubmitting } = form.formState;

  const handleSignIn = async (data: SignInForm) => {
    await authClient.signIn.email({ ...data, callbackURL: "/" }, {
      onSuccess: () => {
        router.push("/")
      },
      onError: error => {
        if (error.error.code === "EMAIL_NOT_VERIFIED") {
          openEmailVerificationTab(data.email)
        }
        toast.error(error.error.message || "ログインに失敗しました")
      },
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>パスワード</FormLabel>
                <Button
                  onClick={openForgotPassword}
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-sm font-normal underline"
                >
                  パスワードお忘れですか?
                </Button>
              </div>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password webauthn"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          {/* <FormField
          control={form.control}
          name="favoriteNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Number</FormLabel>
              <FormControl>
                <NumberInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>
            ログイン
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}

export default SignInTab
