const User = require('../models/User')

const THEMES = ['light', 'dark', 'system']
const APPLICATION_VIEWS = ['list', 'board']

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('name email preferences')
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        return res.status(200).json({ profile: user })
    }
    catch (error) {
        console.error('Get profile error:', error)
        return res.status(500).json({ message: "Failed to load profile." })
    }
}

const updateProfile = async (req, res) => {
    const { name, preferences } = req.body
    const updates = {}

    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 60) {
            return res.status(400).json({ message: 'Name must be between 1 and 60 characters.' })
        }
        updates.name = name.trim()
    }
    if (preferences !== undefined) {
        if (typeof preferences !== 'object' || preferences === null || Array.isArray(preferences)) {
            return res.status(400).json({ message: 'Preferences must be an object.' })
        }

        if (preferences.theme !== undefined) {
            if (!THEMES.includes(preferences.theme)) {
                return res.status(400).json({ message: 'Invalid theme.' })
            }
            updates['preferences.theme'] = preferences.theme
        }

        if (preferences.defaultApplicationView !== undefined) {
            if (!APPLICATION_VIEWS.includes(preferences.defaultApplicationView)) {
                return res.status(400).json({ message: 'Invalid default application view.' })
            }
            updates['preferences.defaultApplicationView'] = preferences.defaultApplicationView
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Please provide at least one field to update.' })
    }

    try {
        const user = await User.findByIdAndUpdate(req.user, { $set: updates }, { new: true, runValidators: true }).select('name email preferences')
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        return res.status(200).json({ message: 'Profile updated successfully.', profile: user })
    }
    catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Please check the profile details and try again.' })
        }
        console.error('Update profile error:', error)
        return res.status(500).json({ message: 'Failed to update profile.' })
    }
}

module.exports = { getProfile, updateProfile }