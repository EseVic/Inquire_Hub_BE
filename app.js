const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const converationRouter = require('./controllers/conversations');
const articleRouter = require('./controllers/article');
const codeRouter = require('./controllers/code');
const paystackRouter = require('./controllers/paystack');

const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(middleware.tokenExtractor);
app.use(middleware.errorHandler);

app.use('/api/users', userRouter);
app.use('/api/conversations', converationRouter);
app.use('/api/articles', articleRouter);
app.use('/api/code', codeRouter);
app.use('/api/login', loginRouter);
app.use('/api/paystack/pay', paystackRouter);

module.exports = app;
