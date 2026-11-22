import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import AuthLayout from "./AuthLayout"
import { AuthInput, PasswordInput } from "./AuthFields"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext.jsx"

function Register() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const redirectTimer = useRef(null)

    const [formState, setFormState] = useState({ name: "", email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const isBusy = loading || Boolean(success)

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

        if (formState.password.length < 8) {
            setError("Password must be at least 8 characters.")
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
        <AuthLayout title="Create your account" subtitle="Start organizing your job search in minutes."
            footer={<>Already have an account?{" "}<Link to="/login" className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Sign in</Link></>}>
            <form onSubmit={handleSubmit} aria-busy={isBusy} className="space-y-5">
                {error && (
                    <div role="alert" aria-live="assertive" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {success && (
                    <div role="status" aria-live="polite" className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-sm text-green-600 dark:text-green-400">
                        {success}
                    </div>
                )}

                <FormField id="name" label="Full Name" required>
                    <AuthInput id="name" name="name" type="text" value={formState.name} onChange={handleChange} placeholder="Enter your name" autoComplete="name" maxLength={60} required disabled={isBusy} />
                </FormField>

                <FormField id="email" label="Email" required>
                    <AuthInput id="email" name="email" type="email" value={formState.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required disabled={isBusy} />
                </FormField>

                <FormField id="password" label="Password" required>
                    <PasswordInput id="password" name="password" value={formState.password} onChange={handleChange} placeholder="Create a password" autoComplete="new-password" disabled={isBusy} />
                    <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
                </FormField>

                <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={isBusy}>
                    {loading ? "Creating account..." : success ? "Account created" : "Create Account"}
                </Button>
            </form>
        </AuthLayout>
    )
}

export default Register