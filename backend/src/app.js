const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())

app.get('/api/health', (req, res) =>{
    res.status(200).json({message: 'Application is running'})
})

module.exports = app