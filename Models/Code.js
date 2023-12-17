const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const codeSchema = Schema(
  {
    message: String,
    response: String,
    date: { type: Date, default: Date.now },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

codeSchema.set('toJSON', {
  transform: (document, returnedDocument) => {
    returnedDocument.id = returnedDocument._id.toString();
    delete returnedDocument._id;
    delete returnedDocument.__v;
  },
});

module.exports = model('Code', codeSchema);
