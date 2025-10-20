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

interface PasswordResetEmailProps {
  user: {
    name: string;
    email: string;
  };
  url: string;
}

const PasswordResetEmailTemplate = ({ user, url }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>パスワードをリセットしてください</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h2}>パスワードをリセットしてください</Heading>

        <Text style={text}>こんにちは {user.name} さん,</Text>

        <Text style={text}>
          パスワードをリセットするため、以下のボタンをクリックしてください。
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            パスワードリセット
          </Button>
        </Section>

        <Text style={text}>
          このリンクをリクエストしていない場合は、このメールを無視してください。
        </Text>

        <Text style={text}>
          このリンクは24時間後に失効します。
        </Text>

        <Text style={text}>
          よろしくお願いします。
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
  backgroundColor: "#007bff",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

export default PasswordResetEmailTemplate;
