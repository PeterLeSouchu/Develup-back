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

// En prod railway bloque ces port, i lfaut passer par Resend par exmple !!!!!!!!!!!!
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
