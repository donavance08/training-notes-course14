import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './src/routes/crmRoutes';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';

const app = express();
const PORT = 3000;

//helment setup
app.use(helmet());

/* *
 * rate-limiter setup
 * we can use this variable as a middleware per specific transaction or in general
 */
const rateLimiter = new RateLimit({
  windowMs: 2 * 1000, // 2 seconds
  max: 5, // limit number of request by 5 per 2 sec per IP
  message: 'You are requesting too fast, please try again after a while', // we can change the default message here
});

app.use(rateLimiter);

// mongoose connection
mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost:37017', {
    useMongoClient: true,
  })
  .then(() => console.log('Connected to mongoDB'))
  .catch((error) => {
    throw error;
  });

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () => console.log(`your server is running on port ${PORT}`));

