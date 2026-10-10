import api from "./api";

export const getFollowUps = async () => {
    const response = await api.get('/followups')
    return response.data
}

export const getFollowUpById = async (id) => {
    const response = await api.get(`/followups/${id}`)
    return response.data
}

export const createFollowUp = async (followUpData) => {
    const response = await api.post('/followups', followUpData)
    return response.data
}

export const updateFollowUp = async (id, followUpData) => {
    const response = await api.put(`/followups/${id}`, followUpData)
    return response.data
}

export const deleteFollowUp = async (id) => {
    const response = await api.delete(`/followups/${id}`)
    return response.data
}

export const getPendingFollowUps = async () => {
    const response = await api.get('/followups/pending')
    return response.data
}

export const getOverdueFollowUps = async () => {
    const response = await api.get('/followups/overdue')
    return response.data
}