const Interview = require('../models/Interview')
const Application = require('../models/Application')

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
        return res.status(500).json({ message: 'Could not find Interview.', error: error.message })
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
        return res.status(500).json({ message: 'Failed to find Interview details.', error: error.message })
    }
}

const updateInterview = async (req, res) => {
    const { id } = req.params
    const updateData = req.body

    try {
        const interview = await Interview.findOneAndUpdate({ _id: id, user: req.user }, updateData, { new: true })
        if (interview) {
            return res.status(200).json({ interview })
        }
        return res.status(404).json({ message: 'Interview Details not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to update interview.', error: error.message })
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
        return res.status(500).json({ message: 'Failed to delete interview.', error: error.message })
    }
}

const getUpcomingInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user, scheduledAt: { $gte: new Date() }, status: 'Scheduled' }).sort({ scheduledAt: 1 })
        return res.status(200).json({ interviews })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find upcoming interviews.', error: error.message })
    }
}

module.exports = { createInterview, getInterviews, getInterviewById, updateInterview, deleteInterview, getUpcomingInterviews }