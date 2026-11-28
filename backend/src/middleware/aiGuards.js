const AiUsage = require('../models/AiUsage')
const User = require('../models/User')

const USER_DAILY_LIMIT = Number(process.env.AI_USER_DAILY_LIMIT) || 15
const GLOBAL_PER_MINUTE_LIMIT = Number(process.env.AI_GLOBAL_PER_MINUTE) || 5
const GLOBAL_DAILY_LIMIT = Number(process.env.AI_GLOBAL_DAILY_LIMIT) || 150

const consume = async (key, limit, ttlSeconds) => {
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            await AiUsage.findOneAndUpdate(
                { key, count: { $lt: limit } },
                { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + ttlSeconds * 1000) } },
                { upsert: true }
            )
            return true
        }
        catch (error) {
            if (error.code !== 11000) throw error
        }
    }
    return false
}

const refund = (key) => AiUsage.updateOne({ key }, { $inc: { count: -1 } }).catch(() => { })

const todayKey = () => new Date().toISOString().slice(0, 10)
const minuteKey = () => new Date().toISOString().slice(0, 16)

const requireAiConsent = async (req, res, next) => {
    const user = await User.findById(req.user).select('preferences.aiEnabled')

    if (!user?.preferences?.aiEnabled) {
        return res.status(403).json({ message: 'AI features are turned off. Turn them on in Settings first.', code: 'ai_disabled' })
    }
    next()
}

const aiLimits = async (req, res, next) => {
    const userKey = `user:${req.user}:${todayKey()}`

    if (!(await consume(userKey, USER_DAILY_LIMIT, 2 * 24 * 3600))) {
        return res.status(429).json({ message: `You have reached today's limit of ${USER_DAILY_LIMIT} AI requests. Please try again tomorrow.`, code: 'user_limit' })
    }

    const busy = !(await consume(`global:minute:${minuteKey()}`, GLOBAL_PER_MINUTE_LIMIT, 120)) || !(await consume(`global:day:${todayKey()}`, GLOBAL_DAILY_LIMIT, 2 * 24 * 3600))

    if (busy) {
        await refund(userKey)
        return res.status(429).json({ message: 'The AI service is busy right now. Please try again in a minute.', code: 'busy' })
    }

    next()
}

const getUsageToday = async (userId) => {
    const doc = await AiUsage.findOne({ key: `user:${userId}:${todayKey()}` }).select('count')
    return { used: doc?.count || 0, limit: USER_DAILY_LIMIT }
}

module.exports = { requireAiConsent, aiLimits, getUsageToday, consume }