import { io } from './app';
import ApiError from './errors/error';
import conversationDatamapper from './datamappers/conversation-datamapper';
import jwt from 'jsonwebtoken';

// Middleware to verify jwt
io.use((socket, next) => {
  const token = socket.handshake.headers.cookie?.jwt;

  if (!token) {
    return next(
      new ApiError('Erreur inattendue, essayer de vous  reconnecter', 401)
    );
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    return next(
      new ApiError('Erreur inattendue, essayer de vous  reconnecter', 401)
    );
  }
});

io.on('connection', (socket) => {
  console.log(`Utilisateur connecté : ${socket.user.id}`);

  socket.on('joinConversation', async (conversationId) => {
    console.log(`${socket.user.id} rejoint la conversation ${conversationId}`);

    const isAllowed = await conversationDatamapper.checkIfUserIsInConversation(
      socket.user.id,
      conversationId
    );
    if (!isAllowed) {
      return socket.emit('error', 'Accès interdit à cette conversation');
    }

    socket.join(conversationId);
  });

  socket.on('newMessage', async (messageData) => {
    const isAllowed = await conversationDatamapper.checkIfUserIsInConversation(
      message.conversationId,
      socket.user.id
    );
    if (!isAllowed) {
      return socket.emit('error', 'Action interdite');
    }

    const { message, conversationId } = messageData;
    // Sauvegarder le message dans la base de données
    const savedMessage = await conversationDatamapper.saveMessage(
      message,
      socket.user.id,
      conversationId
    );
    io.to(conversationId).emit('newMessage', savedMessage);
  });

  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté : ${socket.user.id}`);
  });
});
