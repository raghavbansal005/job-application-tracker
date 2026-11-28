const express = require('express')
const protect = require('../middleware/authMiddleware')
const { requireAiConsent, aiLimits } = require('../middleware/aiGuards')
const { getAiStatus, testAi } = require('../controllers/aiController')

const router = express.Router()

router.get('/status', protect, getAiStatus)
router.post('/test', protect, requireAiConsent, aiLimits, testAi)

module.exports = router