const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    type: { type: String, required: true, enum: ['Online', 'On-site', 'Phone'] },
    status: { type: String, required: true, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    round: { type: String, required: true },
    scheduledAt: { type: Date },
    interviewer: { type: String },
    meetingLink: { type: String },
    notes: { type: String }
},
    {
        timestamps: true
    })

const Interview = mongoose.model('Interview', interviewSchema)

module.exports = Interview