const express = require('express');
const passport = require('passport');
const sporkService = require('../service/spork.service');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  sporkService.getHandler
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  sporkService.postHandler
);

module.exports = router;
