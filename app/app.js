import 'dotenv/config';
import express from 'express';
import router from './routers/router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './errors/error-handler-middleware.js';

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

app.listen(process.env.PORT, () => {
  console.log(`App listening on ${process.env.HOST}`);
});
