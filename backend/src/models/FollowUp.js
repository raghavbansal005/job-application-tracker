const mongoose = require('mongoose')

const followUpSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
    type: { type: String, enum: ['Recruiter Follow-up', 'Thank You', 'Application Follow-up', 'Interview Follow-up'], required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Skipped'], default: 'Pending'},
    dueDate: { type: Date, required: true },
    notes: { type: String }
},
    {
        timestamps: true
    })

const FollowUp = mongoose.model('FollowUp', followUpSchema)

module.exports = FollowUp