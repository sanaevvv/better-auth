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

interface EmailVerificationProps {
  user: {
    name: string;
    email: string;
  };
  url: string;
}

const EmailVerificationTemplate = ({ user, url }: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>メールアドレスを認証してください</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h2}>メールアドレスを認証してください</Heading>

        <Text style={text}>{user.name}さん、こんにちは</Text>

        <Text style={text}>
          ご登録いただき、ありがとうございます！下のボタンをクリックしてメールアドレスを認証してください：
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            メールアドレスを認証
          </Button>
        </Section>

        <Text style={text}>
          アカウントを作成していない場合は、このメールを無視してください。
        </Text>

        <Text style={text}>
          このリンクは24時間で期限切れになります。
        </Text>

        <Text style={text}>
          よろしくお願いいたします。
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

export default EmailVerificationTemplate;
