import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext.jsx"

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isAuthenticated } = useAuth()

    const [formState, setFormState] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const requestedPath = location.state?.from
    const redirectTo = requestedPath ? `${requestedPath.pathname || "/dashboard"}${requestedPath.search || ""}${requestedPath.hash || ""}` : "/dashboard"

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectTo, { replace: true })
        }
    }, [isAuthenticated, navigate, redirectTo])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormState((previous) => ({ ...previous, [name]: value }))
        if (error) setError(null)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (loading) return

        const email = formState.email.trim()

        if (!email || !formState.password) {
            setError("Please enter your email and password")
            return
        }

        try {
            setLoading(true)
            setError(null)

            await login(email, formState.password)
            navigate(redirectTo, { replace: true })
        }
        catch (error) {
            console.error("Login failed.", error)
            setError(error.response?.data?.message || "Failed to login.")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">JobTrack</Link>
                    <h1 className="mt-5 text-3xl font-bold tracking-tight">Welcome back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your job search.</p>
                </div>

                <form onSubmit={handleSubmit} aria-busy={loading} className="space-y-5 rounded-xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                    {error && (
                        <div role="alert" aria-live="assertive" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <FormField id="email" label="Email" required>
                        <input id="email" name="email" type="email" value={formState.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required disabled={loading}
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" />
                    </FormField>

                    <FormField id="password" label="Password" required>
                        <div className="relative">
                            <input id="password" name="password" type={showPassword ? "text" : "password"} value={formState.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" required disabled={loading}
                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" />

                            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} disabled={loading}
                                className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-md px-3 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">
                                {showPassword ? (<EyeOff className="h-4 w-4" />) : (<Eye className="h-4 w-4" />)}
                            </button>
                        </div>
                    </FormField>

                    <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>

                    <p className="text-center text-sm text-muted-foreground">Don't have an account?{" "}
                        <Link to="/register" className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Create one</Link>
                    </p>
                </form>
            </div>
        </main>
    )
}

export default Login