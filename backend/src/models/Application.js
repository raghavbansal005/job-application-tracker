const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    jobUrl: { type: String, trim: true },
    location: { type: String, trim: true },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'], default: 'Full-time' },
    status: { type: String, enum: ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'], default: 'Wishlist' },
    appliedDate: { type: Date },
    notes: { type: String, trim: true, maxlength: 1000 },
    jobDescription: { type: String, trim: true, maxlength: 5000 }
},
    {
        timestamps: true
    })

const Application = mongoose.model('Application', applicationSchema)

module.exports = Application