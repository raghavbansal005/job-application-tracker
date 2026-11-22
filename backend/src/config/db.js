const mongoose = require('mongoose')

let connectionPromise = null

const connectDB = () => {
    if (mongoose.connection.readyState === 1) {
        return Promise.resolve()
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, maxPoolSize: 5 }).then(() => {
            console.log('MongoDB connected successfully')
        }).catch((error) => {
            connectionPromise = null
            throw error
        })
    }
    return connectionPromise
}

module.exports = connectDB