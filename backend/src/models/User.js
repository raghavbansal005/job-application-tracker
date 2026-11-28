const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    preferences: {
        theme: { type: String, enum: ['light', 'dark', 'system'] },
        defaultApplicationView: { type: String, enum: ['list', 'board'], default: 'list' },
        aiEnabled: { type: Boolean, default: false },
        aiConsentAt: { type: Date }
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User