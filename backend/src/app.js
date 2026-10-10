const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const interviewRoutes = require('./routes/interviewRoutes')
const followUpRoutes = require('./routes/followUpRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/followups', followUpRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/api/health', (req, res) =>{
    res.status(200).json({message: 'Application is running'})
})

module.exports = app