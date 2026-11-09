import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  //   return await transporter.sendMail({
  //     from: process.env.EMAIL_FROM,
  //     to,
  //     subject,
  //     text,
  //     html,
  //   });
  console.log({ to, subject, text, html });

  return "email has been sent";
}
