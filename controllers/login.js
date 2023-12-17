/**
 * controllers - login controller
 *
 * An express router (loginRouter) that routes to a /login page
 * uses json_web_tokens and bcryptjs for auhtnetication
 */

const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../Models/Users');

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  // finds a user from the database by its unique email
  const user = await User.findOne({ email });
  const passwordCheck =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCheck)) {
    return res.status(401).json({
      error: 'Invalid password',
    });
  }

  const userDetails = {
    email: user.email,
    id: user.id,
  };

  const token = jwt.sign(userDetails, process.env.CRYPTO_KEY, {});

  res.status(200).send({
    token,
    fullname: user.fullname,
    email: user.email,
    id: user.id,
  });
});

module.exports = loginRouter;
