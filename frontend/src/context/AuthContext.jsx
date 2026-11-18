import { createContext, useContext, useState, useEffect } from "react";

import { loginUser, registerUser, getCurrentUser, logoutUser } from "@/services/authService";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const isAuthenticated = Boolean(user)

    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                setLoading(false)
                return
            }
            try {
                const data = await getCurrentUser()
                setUser(data)
            }
            catch (error) {
                console.error("Failed to restore session.", error)
                localStorage.removeItem("token")
                setUser(null)
            }
            finally {
                setLoading(false)
            }
        }
        restoreSession()
    }, [])

    const login = async (email, password) => {
        const data = await loginUser(email, password)
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        return data
    }

    const register = async (name, email, password) => {
        const data = await registerUser(name, email, password)
        return data
    }

    const updateUser = (changes) => {
        setUser((current) => current ? { ...current, ...changes, preferences: { ...current.preferences, ...changes.preferences } } : current)
    }

    const logout = () => {
        logoutUser()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}