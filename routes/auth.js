const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Passport
const config = require('../config/database');
require('../config/passport')(passport);

// Models
const User = require('../model/user');

// Validations
const validateRegisterPayload = require('../validations/auth/register');
const validateLoginPayload = require('../validations/auth/login');

router.post('/register', function(req, res) {
  const { errors, isValid } = validateRegisterPayload(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // Check exists
  User.findOne({ email: req.body.email }).then(user => {
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
      () => { res.json({msg: `Created user ${req.body.email} successfully`}); },
      (err) => { console.log(err); }
    );
  });
});

router.post('/login', function(req, res) {
  const { errors, isValid } = validateLoginPayload(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  if (!req.body.email || !req.body.password) {
    res.status(400).json({msg: 'Must provide e-mail and password'});

    return;
  }

  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({msg: 'Authentication failed'});

      return;
    }

    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch || err) {
        res.status(401).send({msg: 'Authentication failed'});

        return;
      }

      const payload = {
        name: user.name,
        email: user.email,
      };

      const lastLogin = user.lastLogin;
      const token = jwt.sign(payload, config.secret);

      user.lastLogin = Date.now();
      user.save();

      res.json({token: 'JWT ' + token, lastLogin});
    });
  });
});

module.exports = router;
