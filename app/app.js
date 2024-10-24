// TIERCE MODULES
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.urlencoded({ extended: true }));

// Router
app.use(router);

app.listen(port, () => {
  console.log(`App listening on ` + url + `:` + port);
});
