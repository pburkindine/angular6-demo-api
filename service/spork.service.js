const debug = require('debug')('angular6-demo-api:server');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');

// Models
const Spork = require('../model/spork');

// Validations
const validatePostPayload = require('../validations/spork/post');

module.exports.getHandler = (req, res) => {
  Spork.find(
    null,
    // eslint-disable-next-line prefer-arrow-callback, func-names
    function(sporkFindErr, sporks) {
      if (sporkFindErr) throw sporkFindErr;

      res.json(sporks);
    }
  );
};

module.exports.postHandler = (req, res) => {
  const { errors, isValid } = validatePostPayload(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const spork = new Spork({
    price: req.body.price,
    imageUri: req.body.imageUri,
  });

  spork.save().then(
    () => {
      res.json({ msg: `Created spork successfully` });
    },
    (err) => {
      debug(err);
    }
  );
};
