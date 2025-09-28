import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendMail(email, subject, message) {
  console.log("=== DEBUG SENDMAIL ===");
  console.log("Email destinataire:", email);
  console.log("Sujet:", subject);
  console.log(
    "Variables env EMAIL:",
    process.env.EMAIL ? "DÉFINI" : "MANQUANT"
  );
  console.log(
    "Variables env EMAIL_PASSWORD:",
    process.env.EMAIL_PASSWORD ? "DÉFINI" : "MANQUANT"
  );

  try {
    console.log("Tentative d'envoi email...");
    const result = await transporter.sendMail({
      from: {
        name: "Develup Team",
        address: "develup33@gmail.com",
      },
      to: email,
      subject: subject,
      html: message,
    });
    console.log("✅ Email envoyé avec succès:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Erreur envoi email:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Stack:", error.stack);
    throw error;
  }
}
