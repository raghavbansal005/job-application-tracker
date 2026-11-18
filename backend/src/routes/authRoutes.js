const express = require('express')
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController')
const protect = require('../middleware/authMiddleware')
const { authLimiter } = require('../middleware/rateLimiters')

const router = express.Router()

router.post('/register', authLimiter, registerUser)
router.post('/login', authLimiter, loginUser)
router.get('/me', protect, getCurrentUser)

module.exports = router