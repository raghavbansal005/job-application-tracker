const express = require('express')
const protect = require('../middleware/authMiddleware')
const { getApplicationByStatus, getApplicationSummary, getApplicationsOverTime } = require('../controllers/analyticsController')

const router = express.Router()

router.get('/status', protect, getApplicationByStatus)
router.get('/summary', protect, getApplicationSummary)
router.get('/over-time', protect, getApplicationsOverTime)

module.exports = router