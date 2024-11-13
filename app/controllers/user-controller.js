import ApiError from '../errors/error.js';
import userDatamapper from '../datamappers/user-datamapper.js';
import { sendMail } from '../utils/nodemailer.js';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/hash.js';
import { verifyPassword } from '../utils/hash.js';
import { redis } from '../database/redis.js';
import { v4 as uuidv4 } from 'uuid';
import otpGenerator from 'otp-generator';
import generateUniqueSlug from '../utils/generate-slug.js';

const userController = {
  async sendOTP(req, res) {
    const { email, pseudo, password, passwordConfirm } = req.body;

    // We use it to allow us to target the necessary information in Redis in the next method. Instead of using email, we use id to make our app more secure
    const id = uuidv4();

    const userExist = await userDatamapper.findByEmail(email);

    if (userExist) {
      throw new ApiError(
        'Cet e-mail est déjà associé à un compte existant.',
        409
      );
    }

    if (password !== passwordConfirm) {
      throw new ApiError('Les mots de passe ne correspondent pas', 400);
    }

    const slug = await generateUniqueSlug(pseudo, userDatamapper);
    const passwordHashed = await hashPassword(password);

    const OTPcode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const userData = {
      email,
      pseudo,
      passwordHashed,
      slug,
      OTPcode,
    };

    await redis.set(`otp:${id}`, JSON.stringify(userData), 'EX', 900);

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const subject = 'OTP Code';

    const mailMessage = `<h1> Develup </h1>
      <p>Bonjour ${pseudo},</p>
      <p>Nous vous souhaitons la bienvenue sur Develup! </p>
      <p>Pour valider votre inscription, veuillez renseignez ce code sur notre site: <span style="font-size: 1.5em; font-weight: bold; color: #4A90E2;"> ${OTPcode}</span></p>
      <p>Merci à vous et bonne visite!</p>
    `;

    await sendMail(email, subject, mailMessage);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 900000, // 15min
    });

    res.status(200).json({ message: 'code OTP envoyé' });
  },
  async registerUser(req, res) {
    const { userOTPcode } = req.body;

    const id = req.user.id;

    const redisDataUser = await redis.get(`otp:${id}`);
    if (!redisDataUser) {
      throw new ApiError(
        "Le code OTP n'est plus valide, remplissez de nouveau le formulaire d'inscription pour recevoir un nouveau code OTP",
        400
      );
    }

    const { email, pseudo, passwordHashed, slug, OTPcode } =
      JSON.parse(redisDataUser);

    if (userOTPcode.length < 6) {
      throw new ApiError('Le code OTP doit contenir 6 caractères', 400);
    }

    if (OTPcode !== userOTPcode) {
      throw new ApiError('Code OTP invalide', 400);
    }

    // By default we put this image avatar
    const image = ' https://www.w3schools.com/w3images/avatar2.png';

    const createdUser = await userDatamapper.save(
      email,
      passwordHashed,
      pseudo,
      slug,
      image
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

    res.json({ message: 'Utilisateur créé' });
  },
  async login(req, res) {
    const { email, password } = req.body;
    const userExist = await userDatamapper.findByEmail(email);
    if (!userExist) {
      throw new ApiError('Identifiants incorrects', 401);
    }

    const passwordHashFromDB = userExist.password;

    const isGoodPassword = await verifyPassword(password, passwordHashFromDB);
    if (!isGoodPassword) {
      throw new ApiError('Identifiants incorrects', 401);
    }

    const userToken = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });

    res.cookie('jwt', userToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000, // 1 heure
    });

    res.status(200).json({ message: 'Utilisateur authentifié' });
  },
  async logout(req, res) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });

    // In local
    res.clearCookie('psifi.x-csrf-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });

    // In prod
    // res.clearCookie('__Host-psifi.x-csrf-token', {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'Lax',
    // });
    res.status(200).json({ message: 'Déconnexion réussie' });
  },
  async sendResetLink(req, res) {
    const { email } = req.body;

    const userExist = await userDatamapper.findByEmail(email);
    if (!userExist) {
      throw new ApiError(
        'Lien de réinitialisation du mot de passe envoyé',
        200
      );
    }

    const token = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

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

    const userExist = await userDatamapper.findById(id);
    if (!userExist) {
      throw new ApiError('Une erreur inattendu est survenue', 401);
    }

    const passwordHashed = await hashPassword(password);

    await userDatamapper.changePassword(passwordHashed, id);
    res.json({ message: 'Mot de passe changé' });
  },
  async detailsUser(req, res) {
    const userSlug = req.params.slug;
    console.log('voici le params slug du controller detailUser');
    console.log(userSlug);
    const result = await userDatamapper.getDetailsUser(userSlug);
    console.log('voici le resultat de la requete');
    console.log(result);
    res.status(200).json({
      message: "Récupération des données de l'utilisateur réussie",
      result,
    });
  },
};

export default userController;
