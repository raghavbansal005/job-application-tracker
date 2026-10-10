const mongoose = require('mongoose')
const Application = require('../models/Application')

const getApplicationByStatus = async (req, res) => {
    try {
        const applications = await Application.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
        return res.status(200).json({ applications })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to get Application.', error: error.message })
    }
}

const getApplicationSummary = async (req, res) => {
    try {
        const summary = await Application.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user) } },
            { $facet: { totalApplications: [{ $count: 'count' }], interviews: [{ $match: { status: 'Interview' } }, { $count: 'count' }], offers: [{ $match: { status: 'Offer' } }, { $count: 'count' }], rejected: [{ $match: { status: 'Rejected' } }, { $count: 'count' }] } }
        ])
        const result = summary[0]
        const formattedSummary = { totalApplications: result.totalApplications[0]?.count ?? 0, interviews: result.interviews[0]?.count ?? 0, offers: result.offers[0]?.count ?? 0, rejected: result.rejected[0]?.count ?? 0 }
        return res.status(200).json({ summary: formattedSummary })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to get Application.', error: error.message })
    }
}

const getApplicationsOverTime = async (req, res) => {
    try {
        const applicationsOverTime = await Application.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user), appliedDate: { $ne: null } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$appliedDate' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ])
        return res.status(200).json({ applicationsOverTime })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to get Application.', error: error.message })
    }
}

module.exports = { getApplicationByStatus, getApplicationSummary, getApplicationsOverTime }