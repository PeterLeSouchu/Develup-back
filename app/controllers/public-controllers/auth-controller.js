import userController from '../../datamappers/user-datamapper';

const authController = {
  async login(req, res, next) {
    try {
      const { email, pseudo, password, passwordConfirm } = req.body;
      const userExist = await userController.check(email);
    } catch (error) {
      console.log(error);
    }
  },
};

export default authController;
