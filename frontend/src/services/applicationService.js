import api from "./api";

export const getApplication = async () => {
    const response = await api.get('/applications')
    return response.data
}

export const createApplication = async (applicationData) => {
    const response = await api.post('/applications', applicationData)
    return response.data
}

export const getApplicationById = async (id) => {
    const response = await api.get(`/applications/${id}`)
    return response.data
}

export const updateApplication = async (id, applicationData) => {
    const response = await api.put(`/applications/${id}`, applicationData)
    return response.data
}

export const deleteApplication = async (id) => {
    const response = await api.delete(`/applications/${id}`)
    return response.data
}