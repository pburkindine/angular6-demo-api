const debug = require('debug')('angular6-demo-api:server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    length: { min: 8, max: 32 },
  },
  name: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
  },
  createdOn: {
    type: Date,
    required: true,
  },
});

const saltCallback = (next, user, saltErr, salt) => {
  if (saltErr) {
    return next(saltErr);
  }

  bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
    if (hashErr) {
      return next(hashErr);
    }

    // eslint-disable-next-line no-param-reassign
    user.password = hash;
    next();
  });
};

UserSchema.pre(
  'save',
  // eslint-disable-next-line func-names
  function(next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, saltCallback.bind(this, next, user));
    }
  }
);

// eslint-disable-next-line func-names
UserSchema.methods.comparePassword = function(providedPassword, callback) {
  bcrypt.compare(providedPassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// eslint-disable-next-line func-names
UserSchema.methods.comparePassword = function(providedPassword, callback) {
  bcrypt.compare(providedPassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// eslint-disable-next-line func-names
UserSchema.statics.updateLastLogin = function(user) {
  this.update({ _id: user._id }, { $set: { lastLogin: Date.now() } }, (err) => {
    debug(`Problem updating last login for user with id ${user._id}`, err);
  });
};

module.exports = mongoose.model('User', UserSchema);
