import { createContext } from "react"

export const THEMES = ["light", "dark", "system"]
export const THEME_STORAGE_KEY = "jobtrack-theme"
export const DEFAULT_THEME = "system"

export const ThemeContext = createContext(null)