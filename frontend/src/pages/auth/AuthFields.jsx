import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const inputClassName = "flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"

export function AuthInput({ className = "", ...props }) {
    return <input className={`${inputClassName} ${className}`} {...props} />
}

export function PasswordInput({ id, name, value, onChange, placeholder, autoComplete, disabled }) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative">
            <AuthInput id={id} name={name} type={visible ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
                autoComplete={autoComplete} required disabled={disabled} className="pr-12" />

            <button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} disabled={disabled}
                className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-lg px-3.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    )
}