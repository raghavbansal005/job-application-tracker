const Application = require('../models/Application')
const errorDetail = require('../utils/errorDetail')

const createApplication = async (req, res) => {
    const { company, jobTitle, jobUrl, location, employmentType, status, appliedDate } = req.body

    if (!company || !jobTitle) {
        return res.status(400).json({ message: 'Please provide the company and jobTitle.' })
    }

    try {
        const newApplication = new Application({ user: req.user, company, jobTitle, jobUrl, location, employmentType, status, appliedDate })
        await newApplication.save()
        return res.status(201).json({ message: 'Application created successfully.', application: newApplication })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to create application.', error: errorDetail(error) })
    }
}

const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user })
        return res.status(200).json({ applications })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find application.', error: errorDetail(error) })
    }
}

const getApplicationById = async (req, res) => {
    const { id } = req.params

    try {
        const application = await Application.findOne({ _id: id, user: req.user })
        if (application) {
            return res.status(200).json({ application })
        }
        return res.status(404).json({ message: 'Application not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find application.', error: errorDetail(error) })
    }
}

const updateApplication = async (req, res) => {
    const { id } = req.params
    const allowedFields = ['company', 'jobTitle', 'jobUrl', 'location', 'employmentType', 'status', 'appliedDate']
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
        const application = await Application.findOneAndUpdate({ _id: id, user: req.user }, updateData, { new: true, runValidators: true })
        if (application) {
            return res.status(200).json({ application })
        }
        return res.status(404).json({ message: 'Application not found.' })
    }
    catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Please check the application details and try again.' })
        }
        console.error('Update application error:', error)
        return res.status(500).json({ message: 'Failed to update application.' })
    }
}

const deleteApplication = async (req, res) => {
    const { id } = req.params

    try {
        const application = await Application.findOneAndDelete({ _id: id, user: req.user })
        if (application) {
            return res.status(200).json({ message: 'Application deleted successfully.' })
        }
        return res.status(404).json({ message: 'Application not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to delete application.', error: errorDetail(error) })
    }
}

module.exports = { createApplication, getApplications, getApplicationById, updateApplication, deleteApplication }