import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendMail(email, pseudo, OTP) {
  await transporter.sendMail({
    from: {
      name: 'Develup Team',
      address: 'develup33@gmail.com',
    },
    to: `${email}`,
    subject: 'OTP Code',
    html: `<h1> Develup </h1>
            <p>Bonjour ${pseudo},</p>
            <p>Nous vous souhaitons la bienvenue sur Develup! </p>
            <p>Pour valider votre inscription, veuillez renseignez ce code sur notre site: <span> ${OTP}</span></p>
            <p>Merci à vous et bonne visite!</p>
          `,
  });
}
