import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import AuthLayout from "./AuthLayout"
import { AuthInput, PasswordInput } from "./AuthFields"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext.jsx"

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isAuthenticated } = useAuth()

    const [formState, setFormState] = useState({ email: "", password: "" })
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
        <AuthLayout title="Welcome back" subtitle="Sign in to continue managing your job search."
            footer={<>Don&rsquo;t have an account?{" "}<Link to="/register" className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Create one</Link></>}>
            <form onSubmit={handleSubmit} aria-busy={loading} className="space-y-5">
                {requestedPath && !error && (
                    <p role="status" className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">Please sign in to continue.</p>
                )}

                {error && (
                    <div role="alert" aria-live="assertive" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <FormField id="email" label="Email" required>
                    <AuthInput id="email" name="email" type="email" value={formState.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required disabled={loading} />
                </FormField>

                <FormField id="password" label="Password" required>
                    <PasswordInput id="password" name="password" value={formState.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" disabled={loading} />
                </FormField>

                <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
            </form>
        </AuthLayout>
    )
}

export default Login