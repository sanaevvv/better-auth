import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OrganizationInviteEmailProps {
  invitation: {
    id: string;
  };
  inviter: {
    name: string;
  };
  organization: {
    name: string;
  };
}

const OrganizationInviteEmailTemplate = ({
  invitation,
  inviter,
  organization,
}: OrganizationInviteEmailProps) => (
  <Html>
    <Head />
    <Preview>You're invited to join the {organization.name} organization</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h2}>You're invited to join {organization.name}</Heading>

        <Text style={text}>Hello,</Text>

        <Text style={text}>
          {inviter.name} invited you to join the {organization.name} organization.
          Please click the button below to accept/reject the invitation:
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={`${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}`}>
            Manage Invitation
          </Button>
        </Section>

        <Text style={text}>
          Best regards,
          <br />
          {process.env.EMAIL_SENDER_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: 'Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h2 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#28a745",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

export default OrganizationInviteEmailTemplate;
