import { sendEmail } from "./send-email"
import OrganizationInviteEmailTemplate from "./templates/organization-invite-email-template"

export async function sendOrganizationInviteEmail({
  invitation,
  inviter,
  organization,
  email,
}: {
  invitation: { id: string }
  inviter: { name: string }
  organization: { name: string }
  email: string
}) {
  await sendEmail({
    to: email,
    subject: `You're invited to join the ${organization.name} organization`,
    react: OrganizationInviteEmailTemplate({
      invitation,
      inviter,
      organization
    }),
  })
}
