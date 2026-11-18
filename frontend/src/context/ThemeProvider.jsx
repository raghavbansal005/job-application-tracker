import { useEffect, useState } from "react"

import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY, ThemeContext } from "@/context/themeContext"
import { useAuth } from "@/context/AuthContext"
import { updateProfile } from "@/services/profileService"

const getStoredTheme = () => {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        return THEMES.includes(stored) ? stored : DEFAULT_THEME
    }
    catch {
        console.error("Failed to retrieve theme preference from localStorage")
        return DEFAULT_THEME
    }
}

const getSystemPrefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches

function ThemeProvider({ children }) {
    const { user } = useAuth()
    const userId = user?.userId
    const serverTheme = user?.preferences?.theme

    const [theme, setThemeState] = useState(getStoredTheme)
    const [systemDark, setSystemDark] = useState(getSystemPrefersDark)

    const adoptionKey = userId && serverTheme ? `${userId}:${serverTheme}` : null
    const [adoptedKey, setAdoptedKey] = useState(null)

    if (adoptionKey !== adoptedKey) {
        setAdoptedKey(adoptionKey)

        if (serverTheme) {
            setThemeState(serverTheme)
        }
    }

    useEffect(() => {
        if (!adoptedKey || !serverTheme) return

        try {
            localStorage.setItem(THEME_STORAGE_KEY, serverTheme)
        }
        catch {
            console.error("Failed to store theme preference in localStorage")
        }
    }, [adoptedKey, serverTheme])

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleChange = (event) => setSystemDark(event.matches)

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle("dark", resolvedTheme === "dark")
        root.style.colorScheme = resolvedTheme
    }, [resolvedTheme])

    const setTheme = (nextTheme) => {
        if (!THEMES.includes(nextTheme)) return

        setThemeState(nextTheme)
        try {
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
        } catch {
            console.error("Failed to store theme preference in localStorage")
        }

        if (userId) {
            updateProfile({ preferences: { theme: nextTheme } }).catch((error) => {
                console.error("Failed to save theme to your account:", error)
            })
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>
    )
}

export default ThemeProvider