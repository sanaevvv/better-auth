import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
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
