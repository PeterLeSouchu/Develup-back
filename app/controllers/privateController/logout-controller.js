const logoutController = {
  async logout(req, res) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });
    res.clearCookie('__Host-psifi.x-csrf-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });
    console.log('On envoie une reponse positive');
    res.status(200).json({ message: 'Déconnexion réussie' });
  },
};

export default logoutController;
