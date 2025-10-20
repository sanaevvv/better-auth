import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "@/lib/emails/password-reset-email";
import sendEmailVerificationEmail from "@/lib/emails/email-verification";
import { createAuthMiddleware } from "better-auth/api"
import { sendWelcomeEmail } from "../emails/welcome.email";


export const auth = betterAuth({
  user: {
    additionalFields: {
      favoriteNumber: {
        type: "number",
        required: true
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({user, url}) => {
      await sendPasswordResetEmail({user, url});
    },
  },
  emailVerification: {
    // メール認証完了後の自動ログイン
    autoSignInAfterVerification: true,
    // 新規登録時にメール認証を送信
    sendOnSignUp: true,
    // メールを送信の処理を定義
    sendVerificationEmail: async ({user, url}) => {
      await sendEmailVerificationEmail({user, url});
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // GitHub のプロフィール情報を Better Auth のユーザーフィールドにマッピング
      mapProfileToUser: async (profile) => {
        return {
          favoriteNumber: Number(profile.public_repos) || 0,
        }
      }
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      mapProfileToUser: async () => {
      // Discord のプロフィール情報には favoriteNumber フィールドがないため、0 を返す
        return {
          favoriteNumber: 0,
        }
      }
    },
  },
  sessions:{
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    }
  },
  plugins: [
    //Next.js の cookies() や headers() API と統合
    nextCookies(),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  hooks: {
    after: createAuthMiddleware(async ctx => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        }

        if (user != null) {
          await sendWelcomeEmail(user)
        }
      }
    }),
  },
});
