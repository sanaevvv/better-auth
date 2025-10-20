import { Resend } from 'resend';
import React from 'react';

const resend = new Resend(process.env.RESEND_TOKEN!);

export const sendEmail = async ({to, subject, react}: {to: string, subject: string, react: React.ReactNode}) => {
  return resend.emails.send({
    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to,
    subject,
    react
  })
}
