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
      throw new ApiError("Ce compte n'existe pas");
    }

    const token = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    console.log("L'étape du token est passée");

    const link = `${process.env.HOST_FRONT}/reset-password/${token}`;

    const subject = 'Demande de réinitialisation de mot de passe';

    const mailMessage = `<h1> Develup </h1>
       <p>Bonjour,</p>
       <p>Suite à  votre demande de réinitialisation de mot de passe, <a href=${link}>cliquez ici<a/> pour générer un nouveau mot de passe </p>
       <p>Merci à vous et bonne visite!</p>
       `;

    await sendMail(email, subject, mailMessage);
    console.log('Le mail est envoyé');

    res
      .status(200)
      .json({ infos: 'Demande de réinitialisation de mot de passe envoyée' });
  },
  async resetPassword(req, res) {
    const { token, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    if (!token) return res.status(401).json({ message: 'Aucun token.' });

    // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //   if (err) {
    //     return res.status(403).json({ message: 'Invalid or expired token.' });
    //   }
    //   // Token est valide, vous pouvez accéder aux données décodées
    //   req.user = decoded; // Enregistrer les données utilisateur dans la requête
    //   // Continuez avec le traitement de la requête
    // });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const userExist = await userDatamapper.checkById(id);
    if (!userExist) {
      throw new Error("L'utilisateur n'existe pas");
    }

    const passwordHashed = await hashPassword(password);

    await userDatamapper.changePassword(passwordHashed, id);
    console.log('mot de passe changé avec succes');
    res.json({ infos: 'Mot de passe changé' });
  },
};

export default forgotPasswordController;
