import api from './api'

export const updateProfile = async (changes) => {
    const response = await api.put('/profile', changes)
    return response.data
}