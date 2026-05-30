const express = require('express');
const router = express.Router();
const { register, login, me, refreshToken, logout, upgradeSubscription } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);
router.put('/subscription', authenticate, upgradeSubscription);

module.exports = router;
