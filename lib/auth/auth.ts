import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "@/lib/emails/password-reset-email";
import sendEmailVerificationEmail from "@/lib/emails/email-verification";
import { createAuthMiddleware } from "better-auth/api"
import { sendWelcomeEmail } from "../emails/welcome.email";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-account-verification";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "better-auth/plugins/passkey";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { ac, user, admin } from "@/components/auth/permissions";
import { sendOrganizationInviteEmail } from "../emails/organization-invite-email";
import { and, desc, eq } from "drizzle-orm";
import { member } from "@/drizzle/schema";
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe";
import { STRIPE_PLANS } from "./stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-09-30.clover", // Latest API version as of Stripe SDK v19
})

export const auth = betterAuth({
  appName:"Better Auth",
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendEmailVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        })
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url })
      },
    },
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
    twoFactor(),
    passkey(),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      }
    }),
    organization(
      {
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email,
        })
      },
      }
    ),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        authorizeReference: async({user, referenceId, action}) => {
          const memberItem = await db.query.member.findFirst({
            where: and(
              eq(member.organizationId, referenceId),
              eq(member.userId, user.id)
            ),
          })

          if (
            action === "upgrade-subscription" ||
            action === "cancel-subscription" ||
            action === "restore-subscription"
          ) {
            return memberItem?.role === "owner"
          }

          return memberItem != null
        },
        enabled: true,
        plans: STRIPE_PLANS,

      },
    }),
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
  // セッション作成時に自動でユーザーのアクティブな組織IDを設定
  databaseHooks: {
    session: {
      create: {
        // セッションが作成される前に実行される処理
        before: async userSession => {
          // ユーザーが所属する組織メンバーシップを検索
          const membership=await db.query.member.findFirst({
            where: eq(member.userId, userSession.userId),
            orderBy: desc(member.createdAt),
            columns:{organizationId: true},
          })

          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId,
            },
          }
        }
      }
    }
  }
});
