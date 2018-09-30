const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    length: { min: 8, max: 32 }
  },
  name: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
  },
  createdOn: {
    type: Date,
    required: true
  }
});

const saltCallback = (next, user, err, salt) => {
  if (err) {
    return next(err);
  }

  bcrypt.hash(user.password, salt, null, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
};

UserSchema.pre(
  'save',
  function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(
        10,
        saltCallback.bind(this, next, user)
      )
    }
  }
);

UserSchema.methods.comparePassword = function (providedPassword, callback) {
  bcrypt.compare(providedPassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
