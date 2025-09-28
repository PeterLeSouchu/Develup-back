import "dotenv/config";
import express from "express";
import router from "./routers/router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./errors/error-handler-middleware.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import conversationDatamapper from "./datamappers/conversation-datamapper.js";
import path from "path";

const app = express();

const __dirname = path.resolve();

// This repo is in reality a mono repo when we use the front-end code build named "dist" in public folder, so we use express.static to serve it.
app.use(express.static(path.join(__dirname, "public/dist")));

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    // origin: ['http://localhost:5173'],
    origin: ["https://develup.up.railway.app"],
    credentials: true,
    withCredentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: 'http://localhost:5173',
    // methods: ['GET', 'POST'],
    credentials: true,
  },
  cookie: true,
});

// Socket middleware to verify jwt
io.use((socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ? socket.handshake.headers.cookie
          .split(";")
          .find((cookie) => cookie.trim().startsWith("jwt="))
          .split("=")[1]
      : null;

    if (!token) {
      return socket.emit("error", "Erreur inattendue, réessayez plus tard");
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    return socket.emit("error", "Erreur inattendue, réessayez plus tard");
  }
});

// Serveur Socket
io.on("connection", (socket) => {
  console.log(`Utilisateur connecté : ${socket.user.id}`);
  socket.on("joinConversation", async (conversationId) => {
    try {
      const isAllowed =
        await conversationDatamapper.checkIfUserIsInConversation(
          socket.user.id,
          conversationId
        );

      if (!isAllowed) {
        return socket.emit("error", "Accès interdit à cette conversation");
      }

      socket.join(conversationId);
    } catch (error) {
      console.error(
        "Erreur lors de la tentative de rejoindre une conversation :",
        error
      );
      socket.emit(
        "error",
        "Erreur serveur lors de la tentative de rejoindre la conversation"
      );
    }
  });

  socket.on("newMessage", async (messageData) => {
    try {
      const { message, conversationId } = messageData;

      const isAllowed =
        await conversationDatamapper.checkIfUserIsInConversation(
          socket.user.id,
          conversationId
        );

      if (!isAllowed) {
        return socket.emit("error", "Action interdite");
      }

      const savedMessage = await conversationDatamapper.saveMessage(
        message,
        socket.user.id,
        conversationId
      );
      const timestamp = savedMessage.created_at;
      const date = new Date(timestamp);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      const formattedDate = `le ${day}/${month}/${year} à ${hours}h${minutes}`;

      const messageToSendToClient = {
        id: savedMessage.id,
        date: formattedDate,
        content: savedMessage.content,
        user_id: socket.user.id,
      };

      io.to(conversationId).emit("newMessage", messageToSendToClient);
    } catch (error) {
      console.error("Erreur lors de l'envoi d'un message :", error);
      socket.emit("error", "Erreur serveur lors de l'envoi du message");
    }
  });

  socket.on("disconnect", () => {
    console.log(`Utilisateur déconnecté : ${socket.user.id}`);
  });
});

// We  catch all over route here in order to display front end route if the request is not for back-end route
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/dist', 'index.html'));
// });

server.listen(process.env.PORT, () => {
  console.log(`App listening on ${process.env.HOST}`);
});
