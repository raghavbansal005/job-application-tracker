import { useState } from "react"
import { useNavigate } from "react-router-dom"

import FormField from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext.jsx"

function Register() {
    const navigate = useNavigate()
    const { register } = useAuth()

    const [formState, setFormState] = useState({ name: "", email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormState((previous) => ({ ...previous, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError(null)
            setSuccess(null)

            await register(formState.name, formState.email, formState.password)
            setSuccess("Account created successfully. Redirecting to login...")
            setTimeout(() => { navigate("/login") }, 1000)
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
        <main className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Start managing your job search with JobTrack</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                        <p className="text-sm text-green-600">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <FormField id="name" label="Full Name" required>
                        <input id="name" name="name" type="text" value={formState.name} onChange={handleChange} placeholder="Enter your name" required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <FormField id="email" label="Email" required>
                        <input id="email" name="email" type="email" value={formState.email} onChange={handleChange} placeholder="you@example.com" required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <FormField id="password" label="Password" required>
                        <input id="password" name="password" type="password" value={formState.password} onChange={handleChange} placeholder="Create a password" required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button type="button" onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
                        Sign in
                    </button>
                </p>
            </div>
        </main>
    )
}

export default Register