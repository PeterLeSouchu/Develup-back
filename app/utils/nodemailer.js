import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendMail(email, subject, message) {
  await transporter.sendMail({
    from: {
      name: "Develup Team",
      address: "develup33@gmail.com",
    },
    to: email,
    subject: subject,
    html: message,
  });
}
