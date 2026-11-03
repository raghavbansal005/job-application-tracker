const validObjectId = (req, res, next, id) => {
    if (!/^[a-f\d]{24}$/i.test(id)) {
        return res.status(400).json({ message: 'Invalid ID.' })
    }
    next()
}

module.exports = validObjectId