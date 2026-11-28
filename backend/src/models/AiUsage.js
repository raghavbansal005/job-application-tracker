const mongoose = require('mongoose')

const aiUsageSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    expireAt: { type: Date, default: null }
})

module.exports = mongoose.model('AiUsage', aiUsageSchema)