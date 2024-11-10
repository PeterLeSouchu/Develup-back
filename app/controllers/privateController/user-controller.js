import ApiError from '../../errors/error.js';

const userController = {
  // Here "expires force to clear cookie ( it's a test)
  async logout(req, res) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      expires: new Date(0),
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
};

export default userController;
