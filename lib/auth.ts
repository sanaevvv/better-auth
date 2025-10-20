import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "./emails/password-reset-email";
import sendEmailVerificationEmail from "./emails/email-verification";

export const auth = betterAuth({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'warn' : 'error',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({user, url}) => {
      await sendPasswordResetEmail({user, url});
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({user, url}) => {
      await sendEmailVerificationEmail({user, url});
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
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
});
