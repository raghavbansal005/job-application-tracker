const express = require('express')
const protect = require('../middleware/authMiddleware')
const { createFollowUp, getFollowUps, getFollowUpById, updateFollowUp, deleteFollowUp, getPendingFollowUps, getOverdueFollowUps } = require('../controllers/followUpController')

const router = express.Router()
const validObjectId = require('../middleware/validObjectId')

router.post('/', protect, createFollowUp)
router.get('/', protect, getFollowUps)
router.get('/pending', protect, getPendingFollowUps)
router.get('/overdue', protect, getOverdueFollowUps)
router.get('/:id', protect, getFollowUpById)
router.put('/:id', protect, updateFollowUp)
router.delete('/:id', protect, deleteFollowUp)
router.param('id', validObjectId)

module.exports = router