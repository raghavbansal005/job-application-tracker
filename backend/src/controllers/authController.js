const bcrypt = require('bcryptjs')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')

const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    if (!password || !email || !name) {
        return res.status(400).json({ message: 'Please provide the complete details.' })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name, email, password: hashedPassword })
        await newUser.save()
        return res.status(201).json({ message: 'User registered successfully.' })
    }
    catch (error) {
        return res.status(500).json({ message: 'Registration failed.' })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' })
        }

        const token = generateToken(user._id)
        return res.status(200).json({ message: 'Login successful.', token, userId: user._id })
    }
    catch (error) {
        return res.status(500).json({ message: 'Login failed.' })
    }
}

module.exports = { registerUser, loginUser }