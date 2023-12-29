const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.set('strictQuery', false);

const logger = require('../utils/logger');
const config = require('../utils/config');

const url = config.MONGODB_URI;

logger.info('connecting to ..... MONGODB');

//connecting to the DB
mongoose
  .connect(url)
  .then(() => logger.info('Connected to MONGODB'))
  .catch((err) => logger.error('Error connecting to MONGODB', err));

const userSchema = Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    fullname: {
      type: String,
      require: true,
    },
    passwordHash: {
      type: String,
      require: true,
    },
    conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
    articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    code: [{ type: Schema.Types.ObjectId, ref: 'Code' }],
    rateLimit: { type: Number, default: 0 },
    maxRateLimit: { type: Number, default: 10 },
    isPro: { type: Boolean, default: false },
    payStackRef: String,
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = model('User', userSchema);

module.exports = User;
