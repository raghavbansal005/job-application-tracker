const bcrypt = require('bcryptjs')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$$/

const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !name.trim() || !email.trim() || !password) {
        return res.status(400).json({ message: 'Please provide the complete details.' })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanName.length > 60) {
        return res.status(400).json({ message: 'Name must be 60 characters or fewer.' })
    }
    if (cleanEmail.length > 254 || !EMAIL_REGEX.test(cleanEmail)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' })
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }
    // bcrypt only uses the first 72 bytes of a password
    if (Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({ message: 'Password is too long (maximum 72 bytes).' })
    }

    try {
        const existingUser = await User.findOne({ email: cleanEmail })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name: cleanName, email: cleanEmail, password: hashedPassword })
        await newUser.save()
        return res.status(201).json({ message: 'User registered successfully.' })
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists.' })
        }
        console.error('Registration error:', error)
        return res.status(500).json({ message: 'Registration failed.' })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' })
    }

    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() })
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
        console.error('Login error:', error)
        return res.status(500).json({ message: 'Login failed.' })
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('name email preferences')
        if (!user) {
            return res.status(401).json({ message: "User no longer exists." })
        }
        return res.status(200).json({ message: 'User is authenticated', userId: user._id, name: user.name, email: user.email, preferences: user.preferences })
    }
    catch (error) {
        console.error('Get current user error:', error)
        return res.status(500).json({ message: "Failed to load user." })
    }
}

module.exports = { registerUser, loginUser, getCurrentUser }