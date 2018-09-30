const express = require('express');
const passport = require('passport');

const router = express.Router();

// Services
const authService = require('../service/auth.service');

// Routes
router.post('/register', authService.registerHandler);

router.post('/login', authService.loginHandler);

router.post(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  authService.logoutHandler
);

module.exports = router;
