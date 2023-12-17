/**
 * controllers - user controller
 *
 * Creates a new user from the body request recieved
 * adds the created user to the database
 *
 * An express router (userRouter) that routes to a /user endpoints
 * uses bcryptjs for auhtnetication
 */

const userRouter = require('express').Router();

const User = require('../Models/Users');
const bcrypt = require('bcryptjs');

userRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('conversations', {
      message: 1,
      response: 1,
      date: 1,
    })
    .populate('articles', {
      message: 1,
      response: 1,
      date: 1,
    })
    .populate('code', {
      message: 1,
      response: 1,
      date: 1,
    });

  res.json(users);
});

userRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .populate('conversations', {
      message: 1,
      response: 1,
      date: 1,
    })
    .populate('articles', {
      message: 1,
      response: 1,
      date: 1,
    })
    .populate('code', {
      message: 1,
      response: 1,
      date: 1,
    });

  res.json(user);
});

userRouter.post('/', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      res.status(400).json({
        error: 'All fields are required',
      });
    } else if (password.length < 3) {
      res.status(403).json({
        error: 'password should be above 3 characters',
      });
    } else {
      const salt = 10;

      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = new User({
        fullname,
        email,
        passwordHash,
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    }
  } catch (err) {
    if (err.code === 11000)
      res.status(500).json({
        error: 'Duplicate Key',
      });
    // console.log(err);
  }
});

module.exports = userRouter;
