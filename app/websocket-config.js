import { io } from './app';
import conversationDatamapper from './datamappers/conversation-datamapper';
import jwt from 'jsonwebtoken';

// Middleware to verify jwt
io.use((socket, next) => {
  const token = socket.handshake.headers.cookie?.jwt;
  console.log(token);

  if (!token) {
    return socket.emit('error', 'Erreur innatendue, réessayez plus tard');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    console.log('is okssss');
    next();
  } catch (err) {
    return socket.emit('error', 'Erreur innatendue, réessayez plus tard');
  }
});

io.on('connection', (socket) => {
  console.log(`Utilisateur connecté : ${socket.user.id}`);

  socket.on('joinConversation', async (conversationId) => {
    try {
      console.log(
        `${socket.user.id} rejoint la conversation ${conversationId}`
      );

      const isAllowed =
        await conversationDatamapper.checkIfUserIsInConversation(
          socket.user.id,
          conversationId
        );

      if (!isAllowed) {
        return socket.emit('error', 'Accès interdit à cette conversation');
      }

      socket.join(conversationId);
    } catch (error) {
      console.error(
        'Erreur lors de la tentative de rejoindre une conversation :',
        error
      );
      socket.emit(
        'error',
        'Erreur serveur lors de la tentative de rejoindre la conversation'
      );
    }
  });

  socket.on('newMessage', async (messageData) => {
    console.log('on est dans le on de newMessage');
    try {
      const { message, conversationId } = messageData;

      const isAllowed =
        await conversationDatamapper.checkIfUserIsInConversation(
          conversationId,
          socket.user.id
        );

      if (!isAllowed) {
        return socket.emit('error', 'Action interdite');
      }

      const savedMessage = await conversationDatamapper.saveMessage(
        message,
        socket.user.id,
        conversationId
      );

      const messageToSendToClient = {
        id: savedMessage.id,
        date: savedMessage.created_at,
        content: savedMessage.content,
        isMe: savedMessage.user_id === socket.user.id ? true : false,
      };

      io.to(conversationId).emit('newMessage', messageToSendToClient);
    } catch (error) {
      console.error("Erreur lors de l'envoi d'un message :", error);
      socket.emit('error', "Erreur serveur lors de l'envoi du message");
    }
  });

  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté : ${socket.user.id}`);
  });
});
