import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext.jsx"

function Register() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const redirectTimer = useRef(null)

    const [formState, setFormState] = useState({ name: "", email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        return () => {
            if (redirectTimer.current) {
                clearTimeout(redirectTimer.current)
            }
        }
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormState((previous) => ({ ...previous, [name]: value }))
        setError(null)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (loading) return

        const name = formState.name.trim()
        const email = formState.email.trim()

        if (!name || !email || !formState.password) {
            setError("Please complete all fields.")
            return
        }

        try {
            setLoading(true)
            setError(null)
            setSuccess(null)

            await register(name, email, formState.password)
            setSuccess("Account created successfully. Redirecting to login...")
            redirectTimer.current = setTimeout(() => { navigate("/login", { replace: true }) }, 1000)
        }
        catch (error) {
            console.error("Registration failed.", error)
            setError(error.response?.data?.message || "Failed to create your account.")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        JobTrack
                    </Link>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight">Create your account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Start managing your job search with JobTrack</p>
                </div>

                {error && (
                    <div role="alert" aria-live="assertive" className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {success && (
                    <div role="status" aria-live="polite" className="mb-6 rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-600">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} aria-busy={loading} className="space-y-5 rounded-xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                    <FormField id="name" label="Full Name" required>
                        <input id="name" name="name" type="text" value={formState.name} onChange={handleChange} placeholder="Enter your name" autoComplete="name" maxLength={100} required disabled={loading}
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" />
                    </FormField>

                    <FormField id="email" label="Email" required>
                        <input id="email" name="email" type="email" value={formState.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required disabled={loading}
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" />
                    </FormField>

                    <FormField id="password" label="Password" required>
                        <div className="relative">
                            <input id="password" name="password" type={showPassword ? "text" : "password"} value={formState.password} onChange={handleChange} placeholder="Create a password" autoComplete="new-password" required disabled={loading}
                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" />

                            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} disabled={loading}
                                className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-md px-3 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </FormField>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    )
}

export default Register
