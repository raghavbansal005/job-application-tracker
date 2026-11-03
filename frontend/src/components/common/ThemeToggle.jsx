import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

const OPTIONS = [{ value: "light", label: "Light", Icon: Sun }, { value: "dark", label: "Dark", Icon: Moon }, { value: "system", label: "System", Icon: Monitor }]

function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <div role="group" aria-label="Theme" className="flex items-center rounded-md border border-input p-0.5">
            {OPTIONS.map(({ value, label, Icon }) => (
                <button key={value} type="button" onClick={() => setTheme(value)} aria-pressed={theme === value} aria-label={`${label} theme`} title={`${label} theme`}
                    className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${theme === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="h-4 w-4" />
                </button>
            ))}
        </div>
    )
}

export default ThemeToggle