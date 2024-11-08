import ApiError from '../../errors/error.js';

const logoutController = {
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
    res.clearCookie('__Host-psifi.x-csrf-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });
    res.status(200).json({ message: 'Déconnexion réussie' });
  },
};

export default logoutController;
