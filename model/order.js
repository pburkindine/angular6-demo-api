const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  confirmationNumber: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sporks: [{ type: Schema.Types.ObjectId, ref: 'Spork' }],
});

module.exports = mongoose.model('Order', OrderSchema);
