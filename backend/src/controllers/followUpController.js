const FollowUp = require('../models/Followup')
const Application = require('../models/Application')
const Interview = require('../models/Interview')

const createFollowUp = async (req, res) => {
    const { application, interview, type, status, dueDate, notes } = req.body

    if (!application || !type || !dueDate) {
        return res.status(400).json({ message: 'Please provide the details.' })
    }

    try {
        const existingApplication = await Application.findOne({ _id: application, user: req.user })
        if (existingApplication) {
            if (interview) {
                const existingInterview = await Interview.findOne({ _id: interview, user: req.user, application: application })
                if (existingInterview) {
                    const newFollowUp = new FollowUp({ user: req.user, application, interview, type, status, dueDate, notes })
                    await newFollowUp.save()
                    return res.status(201).json({ message: 'Follow-up created successfully.', followUp: newFollowUp })
                }
                return res.status(404).json({ message: 'Interview not found.' })
            }
            const newFollowUp = new FollowUp({ user: req.user, application, interview, type, status, dueDate, notes })
            await newFollowUp.save()
            return res.status(201).json({ message: 'Follow-up created successfully.', followUp: newFollowUp })
        }
        return res.status(404).json({ message: 'Application not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to create Follow-up.', error: error.message })
    }
}

const getFollowUps = async (req, res) => {
    try {
        const followUps = await FollowUp.find({ user: req.user }).sort({ dueDate: 1 }).populate('application', 'company jobTitle')
        return res.status(200).json({ followUps })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find the Follow Up.', error: error.message })
    }
}

const getFollowUpById = async (req, res) => {
    const { id } = req.params

    try {
        const followUp = await FollowUp.findOne({ _id: id, user: req.user })
        if (followUp) {
            return res.status(200).json({ followUp })
        }
        return res.status(404).json({ message: 'Follow-Up not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to find Follow-Up.', error: error.message })
    }
}

const updateFollowUp = async (req, res) => {
    const { id } = req.params
    const updateData = req.body

    try {
        const followUp = await FollowUp.findOneAndUpdate({ _id: id, user: req.user }, updateData, { new: true })
        if (followUp) {
            return res.status(200).json({ followUp })
        }
        return res.status(404).json({ message: 'Follow-Up details not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to update the follow-up.', error: error.message })
    }
}

const deleteFollowUp = async (req, res) => {
    const { id } = req.params

    try {
        const followUp = await FollowUp.findOneAndDelete({ _id: id, user: req.user })
        if (followUp) {
            return res.status(200).json({ message: 'Follow-Up deleted successfully.' })
        }
        return res.status(404).json({ message: 'Follow-Up details not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to delete the follow-up.', error: error.message })
    }
}

const getPendingFollowUps = async (req, res) => {
    try {
        const followUps = await FollowUp.find({ user: req.user, status: 'Pending' }).sort({ dueDate: 1 })
        return res.status(200).json({ followUps })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find the pending follow-ups.', error: error.message })
    }
}

const getOverdueFollowUps = async (req, res) => {
    try {
        const followUps = await FollowUp.find({ user: req.user, dueDate: { $lt: new Date() }, status: 'Pending' }).sort({ dueDate: 1 })
        return res.status(200).json({ followUps })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find the overdue follow-ups.', error: error.message })
    }
}

module.exports = { createFollowUp, getFollowUps, getFollowUpById, updateFollowUp, deleteFollowUp, getPendingFollowUps, getOverdueFollowUps }