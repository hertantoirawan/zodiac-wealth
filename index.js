import express from 'express';
import methodOverride from 'method-override';
import moment from 'moment';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import root from './routes/root.js';
import zodiac from './routes/zodiac.js';
import match from './routes/match.js';
import wish from './routes/wish.js';
import login from './routes/login.js';
import logout from './routes/logout.js';
import signup from './routes/signup.js';
import user from './routes/user.js';
import stock from './routes/stock.js';
import start from './routes/start.js';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());

dotenv.config();

app.use((req, res, next) => {
  res.locals.user = req.cookies.user;
  res.locals.sign = req.cookies.sign;
  next();
});

app.set('view engine', 'ejs');

moment().format();
moment.suppressDeprecationWarnings = true;

app.use('/', root);
app.use('/zodiac', zodiac);
app.use('/match', match);
app.use('/wish', wish);
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/user', user);
app.use('/stock', stock);
app.use('/start', start);

// start the server listening for requests
app.listen(process.env.PORT || 3004, () => console.log('Server is running...'));
