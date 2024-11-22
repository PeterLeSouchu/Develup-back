import conversationDatamapper from '../datamappers/conversation-datamepper.js';
import ApiError from '../errors/error.js';

const conversationController = {
  async openConversation(req, res) {
    const userId = req.user.id;
    const { message, projectId, userIdCreated } = req.body;

    if (!message) {
      throw new ApiError('Veuillez saisir au moins 1 caractère');
    }

    await conversationDatamapper.sendFirstMessage(
      projectId,
      userId,
      userIdCreated
    );
    res.status(200).json({ message: 'Message envoyé avec succès' });
  },
};

export default conversationController;
