import 'dotenv/config';
import userController from '../../datamappers/user-datamapper.js';
import otpGenerator from 'otp-generator';
import { hashPassword } from '../../utils/hash.js';
import { sendMail } from '../../utils/nodemailer.js';
import { v4 as uuidv4 } from 'uuid';
import userDatamapper from '../../datamappers/user-datamapper.js';
import { redis } from '../../utils/redis.js';
import jwt from 'jsonwebtoken';

const authController = {
  async sendOTP(req, res, next) {
    try {
      const { email, pseudo, password, passwordConfirm } = req.body;

      const id = uuidv4();

      const userExist = await userController.check(email);

      if (userExist) {
        throw new Error('Utilisateur déja inscrit');
      }

      if (password !== passwordConfirm) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      const passwordHashed = await hashPassword(password);

      const OTPcode = otpGenerator.generate(6);

      const userData = {
        email,
        pseudo,
        passwordHashed,
        OTPcode,
      };

      await redis.set(`otp:${id}`, JSON.stringify(userData), 'EX', 600);

      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
      });

      await sendMail(email, pseudo, OTPcode);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 900000, // 15min
      });

      res.status(200).json({ info: 'OTP sented', token });
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: error.message });
    }
  },
  async registerUser(req, res) {
    try {
      const { userOTPcode } = req.body;

      const token = req.cookies.jwt; // Récupère le token depuis les cookies

      if (!token) {
        return res.sendStatus(401);
      }

      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      const { email, pseudo, password, passwordConfirm, OTPcode } =
        JSON.parse(await redis.get(`otp:${id}`)) || {};

      if (!OTPcode) {
        return res
          .status(400)
          .json({ message: "Le code OTP a expiré ou n'existe pas." });
      }

      if (userOTPcode.length < 6) {
        throw new Error('Le code doit contenir 6 caractères');
      }

      if (OTPcode !== userOTPcode) {
        throw new Error('Les codes ne  sont pas identiques');
      }

      // const createdUser = await userDatamapper.save(email, password, pseudo);
      // delete createdUser.password;

      await redis.del(`otp:${email}`);

      console.log(
        `Tout s'est bien passé et voici les info recuperer via redis ${email}|| ${pseudo} `
      );

      res.json({ infos: 'Utilisateur créé' });
    } catch (error) {}
  },
};

export default authController;
