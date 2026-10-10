const express = require('express')
const protect = require('../middleware/authMiddleware')
const { createInterview, getInterviews, getInterviewById, updateInterview, deleteInterview, getUpcomingInterviews } = require('../controllers/interviewController')

const router = express.Router()

router.post('/', protect, createInterview)
router.get('/', protect, getInterviews)
router.get('/upcoming', protect, getUpcomingInterviews)
router.get('/:id', protect, getInterviewById)
router.put('/:id', protect, updateInterview)
router.delete('/:id', protect, deleteInterview)

module.exports = router