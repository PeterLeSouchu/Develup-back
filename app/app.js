import 'dotenv/config';
import express from 'express';
import router from './routers/router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './errors/error-handler-middleware.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ['http://localhost:5173'],
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

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    // methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on ${process.env.HOST}`);
});
