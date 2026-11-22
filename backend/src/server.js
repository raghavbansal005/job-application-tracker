require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db.js')

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        await connectDB()
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error.message)
        process.exit(1)
    }
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })
}

startServer()