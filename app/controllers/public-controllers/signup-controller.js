import userController from '../../datamappers/user-datamapper.js';
import otpGenerator from 'otp-generator';
import { hashPassword } from '../../utils/hash.js';
import { sendMail } from '../../utils/nodemailer.js';
import { v4 as uuidv4 } from 'uuid';
import userDatamapper from '../../datamappers/user-datamapper.js';
import { redis } from '../../database/redis.js';
import jwt from 'jsonwebtoken';
import ApiError from '../../errors/error.js';

const signupController = {
  async sendOTP(req, res) {
    const { email, pseudo, password, passwordConfirm } = req.body;

    // We use it to allow us to target the necessary information in Redis in the next method. Instead of using email, we use id to make our app more secure
    const id = uuidv4();

    const userExist = await userController.checkByEmail(email);

    if (userExist) {
      throw new ApiError(
        'Cet e-mail est déjà associé à un compte existant.',
        409
      );
    }
    console.log('four');

    if (password !== passwordConfirm) {
      throw new ApiError('Les mots de passe ne correspondent pas', 400);
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

    const subject = 'OTP Code';

    const mailMessage = `<h1> Develup </h1>
      <p>Bonjour ${pseudo},</p>
      <p>Nous vous souhaitons la bienvenue sur Develup! </p>
      <p>Pour valider votre inscription, veuillez renseignez ce code sur notre site: <span> ${OTPcode}</span></p>
      <p>Merci à vous et bonne visite!</p>
    `;

    await sendMail(email, subject, mailMessage);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 900000, // 15min
    });

    console.log('code envoyé');

    res.status(200).json({ message: 'code OTP envoyé' });
  },
  async registerUser(req, res) {
    console.log('on est dans le controller de register');
    const { userOTPcode } = req.body;

    const id = req.user.id;

    const redisDataUser = await redis.get(`otp:${id}`);
    if (!redisDataUser) {
      throw new ApiError(
        "Le code OTP n'est plus valide, remplissez de nouveau le formulaire d'inscription pour recevoir un nouveau code OTP",
        400
      );
    }

    const { email, pseudo, passwordHashed, OTPcode } =
      JSON.parse(redisDataUser);

    if (!OTPcode) {
      throw new ApiError(
        "Le code OTP n'est plus valide, remplissez de nouveau le formulaire d'inscription pour recevoir un nouveau code OTP",
        400
      );
    }

    if (userOTPcode.length < 6) {
      throw new ApiError('Le code OTP doit contenir 6 caractères', 400);
    }

    if (OTPcode !== userOTPcode) {
      throw new ApiError('Code OTP invalide', 400);
    }

    const createdUser = await userDatamapper.save(
      email,
      passwordHashed,
      pseudo
    );

    const userToken = jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('jwt', userToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000, // 1 heure
    });

    await redis.del(`otp:${id}`);

    console.log(
      `Tout s'est bien passé et voici les infos recuperées via redis ${email}|| ${pseudo} `
    );

    res.json({ message: 'Utilisateur créé' });
  },
};

export default signupController;
