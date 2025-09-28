import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(email, subject, message) {
  console.log("=== DEBUG SENDMAIL ===");
  console.log("Email destinataire:", email);
  console.log("Sujet:", subject);
  console.log(
    "RESEND_API_KEY:",
    process.env.RESEND_API_KEY ? "DÉFINI" : "MANQUANT"
  );

  try {
    console.log("Tentative d'envoi email avec Resend...");

    const result = await resend.emails.send({
      from: "Develup Team <noreply@develup.up.railway.app>",
      to: email,
      subject: subject,
      html: message,
    });

    console.log("✅ Email envoyé avec succès:", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur envoi email:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
}

// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // En prod railway bloque ces port, i lfaut passer par Resend par exmple !!!!!!!!!!!!
// export async function sendMail(email, subject, message) {
//   await transporter.sendMail({
//     from: {
//       name: "Develup Team",
//       address: "develup33@gmail.com",
//     },
//     to: email,
//     subject: subject,
//     html: message,
//   });
// }
