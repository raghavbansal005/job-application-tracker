const Application = require('../models/Application')

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
        return res.status(500).json({ message: 'Failed to create application.', error: error.message })
    }
}

const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user })
        return res.status(200).json({ applications })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not find application.', error: error.message })
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
        return res.status(500).json({ message: 'Could not find application.', error: error.message })
    }
}

const updateApplication = async (req, res) => {
    const { id } = req.params
    const updateData = req.body

    try {
        const application = await Application.findOneAndUpdate({ _id: id, user: req.user }, updateData, { new: true })
        if (application) {
            return res.status(200).json({ application })
        }
        return res.status(404).json({ message: 'Application not found.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to update application.', error: error.message })
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
        return res.status(500).json({ message: 'Failed to delete application.', error: error.message })
    }
}

module.exports = { createApplication, getApplications, getApplicationById, updateApplication, deleteApplication }