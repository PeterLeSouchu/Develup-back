import userDatamapper from '../../datamappers/user-datamapper';
import { sendMail } from '../../utils/nodemailer';
import jwt from 'jsonwebtoken';

const forgotPasswordController = {
  async sendResetLink(req, res) {
    try {
      const { email } = req.body;

      const userExist = await userDatamapper.checkByEmail(email);
      if (!userExist) {
        throw new Error("Ce compte n'existe pas");
      }

      const token = jwt.sign(process.env.JWT_SECRET, {
        expiresIn: '15m',
      });

      const link = `${process.env.HOST}/reset-password/${token}`;

      const subject = 'Demande de réinitialisation de mot de passe';

      const mailMessage = `<h1> Develup </h1>
       <p>Bonjour,</p>
       <p>Suite à  votre demande de réinitialisation de mot de passe, voici votre lien pour générer un nouveau mot de passe </p>
       <p>Lien : ${link} </p>
       <p>Pensez à bien noter votre nouveau mot de passe quelque part !</p>
       <p>Merci à vous et bonne visite!</p>
       `;

      await sendMail(email, subject, mailMessage);

      res
        .status(200)
        .json({ infos: 'Demande de réinitialisation de mot de passe envoyée' });
    } catch (error) {}
  },
};

export default forgotPasswordController;
