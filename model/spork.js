const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const SporkSchema = new Schema({
  price: {
    type: Number,
    required: true,
  },
  imageUri: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Spork', SporkSchema);
