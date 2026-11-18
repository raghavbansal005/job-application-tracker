const mongoose = require('mongoose')

const Application = require('../models/Application')
const Interview = require('../models/Interview')
const FollowUp = require('../models/FollowUp')
const errorDetail = require('../utils/errorDetail')

const getDashboard = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user)
        const [summary, applicationByStatus, applicationOverTime, upcomingInterviews, pendingFollowUps, overdueFollowUps] = await Promise.all([
            Application.aggregate([
                { $match: { user: userId } },
                { $facet: { totalApplications: [{ $count: 'count' }], interviews: [{ $match: { status: 'Interview' } }, { $count: 'count' }], offers: [{ $match: { status: 'Offer' } }, { $count: 'count' }], rejected: [{ $match: { status: 'Rejected' } }, { $count: 'count' }] } }
            ]),
            Application.aggregate([
                { $match: { user: userId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Application.aggregate([
                { $match: { user: userId, appliedDate: { $ne: null } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$appliedDate' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Interview.find({ user: req.user, scheduledAt: { $gte: new Date() }, status: 'Scheduled' }).sort({ scheduledAt: 1 }).limit(5).populate('application', 'company jobTitle'),
            FollowUp.find({ user: req.user, status: 'Pending' }).sort({ dueDate: 1 }).limit(5).populate('application', 'company jobTitle'),
            FollowUp.find({ user: req.user, dueDate: { $lt: new Date() }, status: 'Pending' }).sort({ dueDate: 1 }).limit(5).populate('application', 'company jobTitle')
        ])

        const summaryResult = summary[0]
        const formattedSummary = { totalApplications: summaryResult.totalApplications[0]?.count ?? 0, interviews: summaryResult.interviews[0]?.count ?? 0, offers: summaryResult.offers[0]?.count ?? 0, rejected: summaryResult.rejected[0]?.count ?? 0 }
        return res.status(200).json({ summary: formattedSummary, applicationByStatus, applicationOverTime, upcomingInterviews, pendingFollowUps, overdueFollowUps })
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to get dashboard data.', error: errorDetail(error) })
    }
}

module.exports = { getDashboard }