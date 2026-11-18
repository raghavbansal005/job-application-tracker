const rateLimit = require('express-rate-limit')

const buildLimiter = (options) => rateLimit({
    standardHeaders: 'draft-7', legacyHeaders: false, ...options
})

const apiLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000, limit: 500, message: { message: 'Too many requests. Please try again later.' }
})

const authLimiter = buildLimiter({
    windowMs: 15 * 60 * 1000, limit: 20, skipSuccessfulRequests: true, message: { message: 'Too many requests. Please wait 15 mintues and try again.' }
})

module.exports = { apiLimiter, authLimiter }