import userDatamapper from '../../datamappers/user-datamapper.js';
import { verifyPassword } from '../../utils/hash.js';
import jwt from 'jsonwebtoken';
import ApiError from '../../errors/error.js';

const signinController = {
  async login(req, res) {
    const { email, password } = req.body;
    const userExist = await userDatamapper.checkByEmail(email);
    if (!userExist) {
      throw new ApiError('Identifiants incorrects', 401);
    }

    const passwordHashFromDB = userExist.password;

    const isGoodPassword = await verifyPassword(password, passwordHashFromDB);
    if (!isGoodPassword) {
      throw new ApiError('Identifiants incorrects', 401);
    }

    const userToken = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('jwt', userToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000, // 1 heure
    });

    res.status(200).json({ message: 'Utilisateur authentifié' });
  },
};

export default signinController;
