import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

const OPTIONS = [{ value: "light", label: "Light", Icon: Sun }, { value: "dark", label: "Dark", Icon: Moon }, { value: "system", label: "System", Icon: Monitor }]

function ThemeToggle({ variant = "default" }) {
    const { theme, setTheme } = useTheme()
    const onHero = variant === "hero"

    return (
        <div role="group" aria-label="Theme" className={`flex items-center rounded-md border p-0.5 ${onHero ? "border-hero-foreground/40" : "border-input"}`}>
            {OPTIONS.map(({ value, label, Icon }) => (
                <button key={value} type="button" onClick={() => setTheme(value)} aria-pressed={theme === value} aria-label={`${label} theme`} title={`${label} theme`}
                    className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${onHero ? "focus-visible:ring-hero-foreground" : "focus-visible:ring-ring"} ${theme === value ? (onHero ? "bg-hero-foreground text-hero" : "bg-primary text-primary-foreground") : (onHero ? "text-hero-foreground/80 hover:text-hero-foreground" : "text-muted-foreground hover:text-foreground")}`}>
                    <Icon className="h-4 w-4" />
                </button>
            ))}
        </div>
    )
}

export default ThemeToggle