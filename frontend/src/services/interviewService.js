import api from "./api";

export const getInterviews = async () => {
    const response = await api.get('/interviews')
    return response.data
}

export const getInterviewById = async (id) => {
    const response = await api.get(`/interviews/${id}`)
    return response.data
}

export const createInterview = async (interviewData) => {
    const response = await api.post('/interviews', interviewData)
    return response.data
}

export const updateInterview = async (id, interviewData) => {
    const response = await api.put(`/interviews/${id}`, interviewData)
    return response.data
}

export const deleteInterview = async (id) => {
    const response = await api.delete(`/interviews/${id}`)
    return response.data
}

export const getUpcomingInterviews = async () => {
    const response = await api.get('/interviews/upcoming')
    return response.data
}