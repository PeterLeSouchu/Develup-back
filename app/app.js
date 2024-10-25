import 'dotenv/config';
import express from 'express';
import router from './routers/router.js';

const app = express();
app.use(express.urlencoded({ extended: true }));

// Router
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`App listening on ${process.env.HOST}`);
});
