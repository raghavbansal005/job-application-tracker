const mongoose = require('mongoose')
const Interview = require('../models/Interview')
const Application = require('../models/Application')
const errorDetail = require('../utils/errorDetail')

const createInterview = async (req, res) => {
    const { application, type, round, scheduledAt, interviewer, meetingLink, notes } = req.body

    if (!application || !type || !round) {
        return res.status(400).json({ message: 'Please provide the fields.' })
    }

    try {
        const existingApplication = await Application.findOne({ _id: application, user: req.user })
        if (existingApplication) {
            const newInterview = new Interview({ user: req.user, application: application, type, round, scheduledAt, interviewer, meetingLink, notes })
            await newInterview.save()
            return res.status(201).json({ message: 'Interview created successfully.', interview: newInterview })
        }
        return res.status(404).json({ message: 'Application not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to create the Interview.' })
    }
}

const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user })
        return res.status(200).json({ interviews })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find Interview.', error: errorDetail(error) })
    }
}

const getInterviewById = async (req, res) => {
    const { id } = req.params

    try {
        const interview = await Interview.findOne({ _id: id, user: req.user })
        if (interview) {
            return res.status(200).json({ interview })
        }
        return res.status(404).json({ message: 'Interview details not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to find Interview details.', error: errorDetail(error) })
    }
}

const updateInterview = async (req, res) => {
    const { id } = req.params
    const allowedFields = ['application', 'type', 'status', 'round', 'scheduledAt', 'interviewer', 'meetingLink', 'notes']
    const updateData = {}

    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            updateData[field] = req.body[field]
        }
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'Please provide at least one field to update.' })
    }

    try {
        if (updateData.application !== undefined) {
            if (!mongoose.isValidObjectId(updateData.application)) {
                return res.status(400).json({ message: 'Please provide a valid application.' })
            }
            const ownedApplication = await Application.findOne({ _id: updateData.application, user: req.user })
            if (!ownedApplication) {
                return res.status(404).json({ message: 'Application not found.' })
            }
        }

        const interview = await Interview.findOneAndUpdate({ _id: id, user: req.user }, updateData, { new: true, runValidators: true })
        if (interview) {
            return res.status(200).json({ interview })
        }
        return res.status(404).json({ message: 'Interview Details not found.' })
    }
    catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Please check the interview details and try again.' })
        }
        console.error('Update interview error:', error)
        return res.status(500).json({ message: 'Failed to update interview.' })
    }
}

const deleteInterview = async (req, res) => {
    const { id } = req.params

    try {
        const interview = await Interview.findOneAndDelete({ _id: id, user: req.user })
        if (interview) {
            return res.status(200).json({ message: 'Interview deleted successfully. ' })
        }
        return res.status(404).json({ message: 'Interview Details not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to delete interview.', error: errorDetail(error) })
    }
}

const getUpcomingInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user, scheduledAt: { $gte: new Date() }, status: 'Scheduled' }).sort({ scheduledAt: 1 })
        return res.status(200).json({ interviews })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find upcoming interviews.', error: errorDetail(error) })
    }
}

module.exports = { createInterview, getInterviews, getInterviewById, updateInterview, deleteInterview, getUpcomingInterviews }