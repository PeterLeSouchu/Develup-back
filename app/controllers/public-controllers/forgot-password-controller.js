import userDatamapper from '../../datamappers/user-datamapper.js';
import { sendMail } from '../../utils/nodemailer.js';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../../utils/hash.js';
import ApiError from '../../errors/error.js';

const forgotPasswordController = {
  async sendResetLink(req, res) {
    const { email } = req.body;

    const userExist = await userDatamapper.checkByEmail(email);
    if (!userExist) {
      throw new ApiError(
        'Lien de réinitialisation du mot de passe envoyé',
        200
      );
    }

    const token = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    console.log(token);

    const link = `${process.env.HOST_FRONT}/reset-password/${token}`;

    const subject = 'Demande de réinitialisation de mot de passe';

    const mailMessage = `<h1> Develup </h1>
       <p>Bonjour,</p>
       <p>Suite à  votre demande de réinitialisation de mot de passe, <a href=${link}>cliquez ici<a/> pour générer un nouveau mot de passe </p>
       <p>Merci à vous et bonne visite!</p>
       `;

    await sendMail(email, subject, mailMessage);

    res
      .status(200)
      .json({ message: 'Lien de réinitialisation du mot de passe envoyé' });
  },
  async resetPassword(req, res) {
    const { password, passwordConfirm } = req.body;
    const id = req.user.id;

    if (password !== passwordConfirm) {
      throw new ApiError('Les mots de passe ne correspondent pas', 400);
    }

    const userExist = await userDatamapper.checkById(id);
    if (!userExist) {
      throw new ApiError("Le lien de réinitialisation n'est plus valide", 401);
    }

    const passwordHashed = await hashPassword(password);

    await userDatamapper.changePassword(passwordHashed, id);
    console.log('mot de passe changé avec succes');
    res.json({ message: 'Mot de passe changé' });
  },
};

export default forgotPasswordController;
