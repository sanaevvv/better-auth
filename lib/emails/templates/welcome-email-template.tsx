import React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

interface WelcomeEmailTemplateProps {
  user: {
    name: string
    email: string
  }
}

const WelcomeEmailTemplate = ({ user }: WelcomeEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>ご登録ありがとうございます</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h2}>ご登録ありがとうございます</Heading>
        <Text style={text}>{user.name} さん、ようこそ！</Text>
        <Text style={text}>
          この度はご登録いただきありがとうございます。私たちのサービスに興味をお持ちいただけたことを嬉しく思います。
        </Text>
        <Text style={text}>
          何かご不明点があれば、お気軽にご返信ください。
        </Text>
        <Text style={text}>
          今後ともよろしくお願いいたします。
          <br />
          {process.env.EMAIL_SENDER_NAME ?? "運営チーム"}
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
}

const h2 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

export default WelcomeEmailTemplate
