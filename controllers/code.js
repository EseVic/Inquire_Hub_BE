/**
 * controllers - code controller
 *
 * Creates a new conversation from the body request recieved
 * and connects with a authenticated user
 * adds the created message to the database
 *
 * An express router (codeRouter) that routes to a /code endpoints
 * uses bcryptjs for auhtnetication
 */

const codeRouter = require('express').Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const { userExtractor } = require('../utils/middleware');
const Code = require('../Models/Code');

codeRouter.get('/', async (req, res) => {
  const messages = await Code.find({}).populate('user', {
    fullname: 1,
    email: 1,
  });
  res.json(messages);
});

codeRouter.post('/', userExtractor, async (req, res) => {
  const { message } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({
      error: 'Unauthorized request',
    });
  }

  if (!openai.apiKey) {
    res.status(500).json({
      error: 'OpenAI key not configured',
    });
  }

  if (!message) {
    res.status(400).json({
      error: 'Message is required',
    });
  }

  const rateLimit = await user?.rateLimit;
  const maxRateLimit = await user?.maxRateLimit;

  if (rateLimit >= maxRateLimit) {
    res.status(429).json({
      error: 'Free tier exceeded, subscribe to continue inquiring',
    });
  } else {
    const instructionMessage =
      'You are a code generator. You must answer using markdown code snippets. Use code comments for explanation. ';

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `${instructionMessage}${message}` },
      ],
    });

    if (!response) {
      res.status(400).json({
        error: 'Something went wrong, try again',
      });
    }

    const { content } = await response.choices[0].message;

    const newCodeSnippet = new Code({
      message,
      response: content,
      user: user.id,
    });

    const savedCodeSnippet = await newCodeSnippet.save();
    user.code = user.code.concat(savedCodeSnippet._id);
    user.rateLimit =
      user.rateLimit < maxRateLimit ? user.rateLimit + 1 : user.rateLimit + 0;
    await user.save();

    res.status(201).json(savedCodeSnippet);
  }
});

module.exports = codeRouter;
