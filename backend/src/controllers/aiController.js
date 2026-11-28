const User = require('../models/User')
const { isConfigured, generateJson, buildSystemInstruction, sendAiError } = require('../services/aiService')
const { getUsageToday } = require('../middleware/aiGuards')

const getAiStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('preferences.aiEnabled')
        const usage = await getUsageToday(req.user)

        return res.status(200).json({ configured: isConfigured(), enabled: Boolean(user?.preferences?.aiEnabled), usedToday: usage.used, dailyLimit: usage.limit })
    }
    catch (error) {
        console.error('AI status error:', error)
        return res.status(500).json({ message: 'Failed to load AI status.' })
    }
}

const testAi = async (req, res) => {
    try {
        const result = await generateJson({
            systemInstruction: buildSystemInstruction('Reply with this JSON shape: {"ok": true, "greeting": "<one short friendly sentence>"}'),
            userText: 'Say hello to a job seeker.',
            maxOutputTokens: 256,
        })

        if (typeof result?.greeting !== 'string') {
            return res.status(502).json({ message: 'The AI service returned an unusable answer. Please try again.', code: 'bad_output' })
        }

        return res.status(200).json({ ok: true, greeting: result.greeting.slice(0, 300) })
    }
    catch (error) {
        return sendAiError(res, error)
    }
}

module.exports = { getAiStatus, testAi }