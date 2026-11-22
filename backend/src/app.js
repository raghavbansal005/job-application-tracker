const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const authRoutes = require('./routes/authRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const interviewRoutes = require('./routes/interviewRoutes')
const followUpRoutes = require('./routes/followUpRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const profileRoutes = require('./routes/profileRoutes')

const connectDB = require('./config/db')
const { apiLimiter } = require('./middleware/rateLimiters')

const app = express()
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim())

app.use(helmet())
app.use(cors({ origin: allowedOrigins }))
app.use('/api', apiLimiter)
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Application is running' })
})

app.use('/api', async (req, res, next) => {
    try {
        await connectDB()
        next()
    }
    catch (error) {
        console.error('Database connection failed:', error.message)
        res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' })
    }
})

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/followups', followUpRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/profile', profileRoutes)

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid JSON in request body.' })
    }

    const status = err.status >= 400 && err.status < 500 ? err.status : 500
    if (status === 500) {
        console.error(err)
    }
    res.status(status).json({ message: status === 500 ? 'Something went wrong.' : 'Invalid request.' })
})

module.exports = app