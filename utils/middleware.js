const logger = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../Models/Users');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' });
  else if (err.name === 'ValidationError')
    return res.status(400).send({ error: 'All fields required' });
  else if (err.name === 'JsonWebTokenError')
    return res.status(400).json({ error: 'Invalid token' });
  else if (err.name === 'TokenExpiredError')
    return res.status(400).json({ error: 'Token expired' });

  next(err);
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization' || 'Authorization');

  if (auth && auth.startsWith('Bearer ')) {
    const updatedAuth = auth.replace('Bearer ', '');

    req.token = updatedAuth;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.CRYPTO_KEY);

  if (!decodedToken) {
    return res.status(400).json({ error: 'Token invalid' });
  }
  req.user = await User.findById(decodedToken.id);
  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
