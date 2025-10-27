import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, { BotOptions, detectBot, EmailOptions, protectSignup, shield, slidingWindow, SlidingWindowRateLimitOptions, tokenBucket } from "@arcjet/next";
import { findIp } from "@arcjet/ip";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  // 評価の判断軸に使用
  characteristics: ["userIdOrIp"],
  rules: [
   // SQLインジェクションなどの一般的な攻撃を防御
    shield({ mode: "LIVE" }),
  ],
});

const botSettings = {
  mode: "LIVE",
  allow: ["STRIPE_WEBHOOK"]
} satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 5,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const laxRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export async function POST(request: Request) {
// Requestオブジェクトは1回しかbodyを読み取れないため、クローンを作っておく
const clonedRequest = request.clone()
// この時点で request の body が消費される
const decision = await checkArcjet(request)

  // 評価が拒否(ブロック)された場合
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 })
    } else if (decision.reason.isEmail()) {
      let message: string

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "メールアドレスの形式が正しくありません。"
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "使い捨てメールアドレスは使用できません。"
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "メールアドレスのドメインが無効です。"
      } else {
        message = "無効なメールアドレスです。"
      }

      return Response.json({ message }, { status: 400 })
    } else {
      return new Response(null, { status: 403 })
    }
  }

  // クローン を使ってハンドラーを呼び出す
  return authHandlers.POST(clonedRequest)
}

async function checkArcjet(request: Request) {

  const body = await request.json() as unknown
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1";

  if (request.url.endsWith("/auth/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          })
        )
        // リクエストを評価：userIdOrIpごとにレートカウントやボット判定する
        .protect(request, { email: body.email, userIdOrIp })
    } else {
      // メールアドレスがない場合、「protectSignup」 は使用できない
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, { userIdOrIp })
    }
  }

   return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp })
}
