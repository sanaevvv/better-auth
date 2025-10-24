import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, passkeyClient, twoFactorClient, adminClient } from "better-auth/client/plugins";
import { auth } from "./auth";
import { ac, admin, user } from "@/components/auth/permissions"

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    passkeyClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
      window.location.href = "/auth/2fa"
      }
    }),
      adminClient({
      ac,
      roles: {
        admin,
        user,
      }
    })
  ]
});
