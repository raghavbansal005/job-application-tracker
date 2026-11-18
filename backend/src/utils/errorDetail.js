const errorDetail = (error) => {
    console.error(error)
    return process.env.NODE_ENV === 'production' ? undefined : error.message
}

module.exports = errorDetail