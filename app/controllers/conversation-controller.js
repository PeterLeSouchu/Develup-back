import conversationDatamapper from '../datamappers/conversation-datamapper.js';
import ApiError from '../errors/error.js';

const conversationController = {
  async openConversation(req, res) {
    const userId = req.user.id;
    const { message, projectId, userIdCreated } = req.body;

    if (!message) {
      throw new ApiError('Veuillez saisir au moins 1 caractère', 400);
    }

    const isAlreadyConversation =
      await conversationDatamapper.checkConversationExist(projectId, userId);

    if (isAlreadyConversation) {
      throw new ApiError('Cette conversation est déjà ouverte', 400);
    }

    const conversationCreated = await conversationDatamapper.sendFirstMessage(
      projectId,
      userId,
      userIdCreated
    );

    await conversationDatamapper.sendMessage(
      message,
      userId,
      conversationCreated.id
    );

    res.status(200).json({
      message: 'Message envoyé avec succès',
      result: conversationCreated.id,
    });
  },

  async getAllConversations(req, res) {
    const userId = req.user.id;

    const allConversation = await conversationDatamapper.getAllConversations(
      userId
    );

    const result = allConversation.map((conversation) => {
      const pseudoToDisplay =
        userId === conversation.author_message_id
          ? 'Vous'
          : conversation.author_message_pseudo;

      return { ...conversation, author_message_pseudo: pseudoToDisplay };
    });

    res
      .status(200)
      .json({ message: 'Conversations récupérées avec succès', result });
  },

  async getOneConversation(req, res) {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const isUserAllowed =
      await conversationDatamapper.checkIfUserIsInConversation(
        userId,
        conversationId
      );

    if (!isUserAllowed) {
      throw new ApiError(
        'Une erreur innatendue est survenue, essayez de vous reconnecter pour résoudre ce problème',
        403
      );
    }

    const conversation =
      await conversationDatamapper.getMessagesFromConversation(conversationId);

    // Here i add a propriety name 'isMe' (boolean) in a object message in order to know if it's the user that send the message
    const messagesFormated = conversation.messages.map((message) => {
      return message.author_id === userId
        ? { ...message, isMe: true }
        : { ...message, isMe: false };
    });

    const result = { ...conversation, messages: messagesFormated };

    res
      .status(200)
      .json({ message: 'Conversation récupérée avec succès', result });
  },
};

export default conversationController;
