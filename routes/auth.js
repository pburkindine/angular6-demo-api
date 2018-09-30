const express = require('express');

const router = express.Router();

// Services
const authService = require('../service/auth.service');

// Routes
router.post('/register', authService.registerHandler);

router.post('/login', authService.loginHandler);

module.exports = router;
