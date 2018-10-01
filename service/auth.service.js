const debug = require('debug')('angular6-demo-api:server');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Passport
const config = require('../config/database');
require('../config/passport')(passport);

// Models
const User = require('../model/user');

// Validations
const validateRegisterPayload = require('../validations/auth/register');
const validateLoginPayload = require('../validations/auth/login');

module.exports.loginHandler = (req, res) => {
  const { errors, isValid } = validateLoginPayload(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne(
    {
      email: req.body.email,
    },
    // eslint-disable-next-line prefer-arrow-callback, func-names
    function(userFindErr, user) {
      if (userFindErr) throw userFindErr;

      if (!user) {
        debug(`No user retrieved for ${req.body.email}`);
        res.status(401).send({ msg: 'Authentication failed' });

        return;
      }

      // eslint-disable-next-line prefer-arrow-callback, func-names
      user.comparePassword(req.body.password, function(
        passwordCompareErr,
        isMatch
      ) {
        if (!isMatch || passwordCompareErr) {
          debug(`Bad password for ${req.body.email}`, passwordCompareErr);
          res.status(401).send({ msg: 'Authentication failed' });

          return;
        }

        const payload = {
          name: user.name,
          email: user.email,
        };

        // eslint-disable-next-line prefer-destructuring
        const lastLogin = user.lastLogin;
        const token = jwt.sign(payload, config.secret, { expiresIn: '30m' });

        User.updateLastLogin(user);

        res.json({ token: `Bearer ${token}`, lastLogin });
      });
    }
  );
};

module.exports.logoutHandler = (req, res) => {
  // TODO JWT blacklisting unimplemented; no redis in the stack yet

  res.send();
};

module.exports.registerHandler = (req, res) => {
  const { errors, isValid } = validateRegisterPayload(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // Check exists
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = 'E-mail already registered';

      return res.status(400).json(errors);
    }

    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      createdOn: Date.now(),
    });

    newUser.save().then(
      () => {
        res.json({ msg: `Created user ${req.body.email} successfully` });
      },
      (err) => {
        debug(err);
      }
    );
  });
};
