const express = require('express')
const protect = require('../middleware/authMiddleware')
const { createApplication, getApplications, getApplicationById, updateApplication, deleteApplication } = require('../controllers/applicationController')

const router = express.Router()
const validObjectId = require('../middleware/validObjectId')

router.post('/', protect, createApplication)
router.get('/', protect, getApplications)
router.get('/:id', protect, getApplicationById)
router.put('/:id', protect, updateApplication)
router.delete('/:id', protect, deleteApplication)
router.param('id', validObjectId)

module.exports = router