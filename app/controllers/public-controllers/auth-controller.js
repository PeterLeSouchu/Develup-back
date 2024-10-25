import userController from '../../datamappers/user-datamapper.js';
import { redis } from '../../utils/redis.js';
import otpGenerator from 'otp-generator';
import { hashPassword } from '../../utils/hash.js';
import { sendMail } from '../../utils/nodemailer.js';

const authController = {
  async sendOTP(req, res, next) {
    try {
      const { email, pseudo, password, passwordConfirm } = req.body;

      const userExist = await userController.check(email);

      if (userExist) {
        throw new Error('Utilisateur déja inscrit');
      }

      if (password !== passwordConfirm) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      const passwordHashed = hashPassword(password);

      const userData = {
        email,
        pseudo,
        passwordHashed,
        OTP,
      };

      await redis.set(`otp:${email}`, JSON.stringify(userData), 'EX', 600);

      const OTP = otpGenerator.generate(6);
      console.log(OTP);

      await sendMail(email, pseudo, OTP);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: error.message });
    }
  },
};

export default authController;
