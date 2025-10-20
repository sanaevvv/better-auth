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

const signUpSchema = z.object({
  name: z.string().min(1, { message: "必須です" }),
  email: z.email().min(1, { message: "必須です" }),
  password: z.string().min(6, { message: "6文字以上で入力してください" }),
})

type SignUpForm = z.infer<typeof signUpSchema>

// エラーメッセージを日本語に変換する関数
const getJapaneseErrorMessage = (errorMessage: string): string => {
  if (errorMessage.includes("User already exists")) return "このメールアドレスは既に使用されています";
  if (errorMessage.includes("Invalid email")) return "メールアドレスの形式が正しくありません";
  if (errorMessage.includes("Password too short")) return "パスワードが短すぎます";
  if (errorMessage.includes("validation")) return "入力内容に問題があります";
  return "新規登録に失敗しました";
};

const SignUpTab = () => {
  const router = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const { isSubmitting } = form.formState;

  const handleSignUp = async (data: SignUpForm) => {
    await authClient.signUp.email({ ...data, callbackURL: "/" }, {
      onSuccess: () => {
        toast.success("新規登録が成功しました")
        router.push("/")
      },
      onError: (error) => {
        const errorMessage = error.error.message;
        console.log(errorMessage);
        toast.error(getJapaneseErrorMessage(errorMessage));
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
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
            新規登録
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}

export default SignUpTab
