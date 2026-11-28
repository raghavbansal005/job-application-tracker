import { useState } from "react"

import PageHeader from "@/components/layout/PageHeader"
import PageContainer from "@/components/layout/PageContainer"
import FormField from "@/components/common/FormField"
import ThemeToggle from "@/components/common/ThemeToggle"
import { Button } from "@/components/ui/button"

import { useAuth } from "@/context/AuthContext"
import { updateProfile } from "@/services/profileService"

const inputClasses = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"

function Settings() {
    const { user, updateUser } = useAuth()

    const [name, setName] = useState(user?.name || "")
    const [savingName, setSavingName] = useState(false)
    const [defaultView, setDefaultView] = useState(user?.preferences?.defaultApplicationView || "list")
    const [savingView, setSavingView] = useState(false)
    const [message, setMessage] = useState(null)
    const [aiEnabled, setAiEnabled] = useState(Boolean(user?.preferences?.aiEnabled))
    const [savingAi, setSavingAi] = useState(false)

    const handleNameSubmit = async (event) => {
        event.preventDefault()

        if (savingName) return

        const trimmedName = name.trim()
        if (!trimmedName) {
            setMessage({ type: "error", text: "Name cannot be empty." })
            return
        }
        if (trimmedName === user?.name) {
            setMessage({ type: "success", text: "Your name is already up to date." })
            return
        }

        try {
            setSavingName(true)
            setMessage(null)

            const data = await updateProfile({ name: trimmedName })
            updateUser({ name: data.profile.name })
            setName(data.profile.name)
            setMessage({ type: "success", text: "Profile updated." })
        }
        catch (error) {
            console.error("Failed to update profile:", error)
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile." })
        }
        finally {
            setSavingName(false)
        }
    }

    const handleViewChange = async (event) => {
        const nextView = event.target.value
        const previousView = defaultView

        if (savingView || nextView === previousView) return

        setDefaultView(nextView)

        try {
            setSavingView(true)
            setMessage(null)

            const data = await updateProfile({ preferences: { defaultApplicationView: nextView } })
            updateUser({ preferences: { defaultApplicationView: data.profile.preferences.defaultApplicationView } })
            setMessage({ type: "success", text: "Default view saved." })
        }
        catch (error) {
            console.error("Failed to save default view:", error)
            setDefaultView(previousView)
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to save default view. The change was reverted." })
        }
        finally {
            setSavingView(false)
        }
    }

    const handleAiToggle = async () => {
        if (savingAi) return

        const previousValue = aiEnabled
        const nextValue = !previousValue

        setAiEnabled(nextValue)
        try {
            setSavingAi(true)
            setMessage(null)

            const data = await updateProfile({ preferences: { aiEnabled: nextValue } })

            updateUser({ preferences: { aiEnabled: data.profile.preferences.aiEnabled } })
            setMessage({ type: "success", text: nextValue ? "AI features turned on." : "AI features turned off." })
        }
        catch (error) {
            console.error("Failed to save AI setting:", error)
            setAiEnabled(previousValue)
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to save the AI setting. The change was reverted." })
        }
        finally {
            setSavingAi(false)
        }
    }

    return (
        <PageContainer>
            <div className="space-y-8">
                <PageHeader title="Settings" description="Manage your profile and how JobTrack looks and behaves." />
                <div role="status" aria-live="polite">
                    {message && (
                        <p className={`rounded-md border px-3 py-2 text-sm ${message.type === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"}`}>
                            {message.text}
                        </p>
                    )}
                </div>

                <section aria-labelledby="profile-heading" className="rounded-xl border border-border/60 bg-card p-5">
                    <h2 id="profile-heading" className="font-semibold text-foreground">Profile</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Your name appears in the sidebar and header.</p>
                    <form onSubmit={handleNameSubmit} className="mt-5 max-w-md space-y-4" aria-busy={savingName}>

                        <FormField id="settings-name" label="Name" required>
                            <input id="settings-name" type="text" value={name} maxLength={60} disabled={savingName} onChange={(event) => { setName(event.target.value); setMessage(null) }} autoComplete="name" className={inputClasses} />
                        </FormField>

                        <FormField id="settings-email" label="Email">
                            <input id="settings-email" type="email" value={user?.email || ""} disabled readOnly className={inputClasses} />
                            <p className="text-xs text-muted-foreground">Email changes are not available yet.</p>
                        </FormField>

                        <Button type="submit" disabled={savingName}>{savingName ? "Saving..." : "Save changes"}</Button>
                    </form>
                </section>

                <section aria-labelledby="appearance-heading" className="rounded-xl border border-border/60 bg-card p-5">
                    <h2 id="appearance-heading" className="font-semibold text-foreground">Appearance</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Choose Light, Dark, or follow your device setting. Saved to your account.</p>
                    <div className="mt-5 w-fit">
                        <ThemeToggle />
                    </div>
                </section>

                <section aria-labelledby="preferences-heading" className="rounded-xl border border-border/60 bg-card p-5">
                    <h2 id="preferences-heading" className="font-semibold text-foreground">Preferences</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Saved to your account.</p>

                    <div className="mt-5 max-w-md">
                        <FormField id="settings-default-view" label="Default Applications view">
                            <select id="settings-default-view" value={defaultView} onChange={handleViewChange} disabled={savingView} className={inputClasses}>
                                <option value="list">List</option>
                                <option value="board">Board</option>
                            </select>
                        </FormField>
                    </div>
                </section>

                <section aria-labelledby="ai-heading" className="rounded-xl border border-border/60 bg-card p-5">
                    <h2 id="ai-heading" className="font-semibold text-foreground">AI features</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Optional tools powered by Google&rsquo;s Gemini API, such as importing a job description. They are off until you turn them on.</p>

                    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                        <li>Only the text you choose to submit (for example, a job description) is sent to Google.</li>
                        <li>On Google&rsquo;s free tier, submitted text may be used to improve Google&rsquo;s products, and people may review it. Don&rsquo;t include phone numbers, addresses or other personal details.</li>
                        <li>AI can make mistakes. Always check the result. Nothing is saved or sent for you automatically.</li>
                        <li>A daily usage limit applies.</li>
                    </ul>

                    <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 p-4">
                        <div>
                            <p id="ai-switch-label" className="text-sm font-medium text-foreground">Turn on AI features</p>
                            <p id="ai-switch-description" className="text-xs text-muted-foreground">You can turn this off at any time.</p>
                        </div>

                        <button type="button" role="switch" aria-checked={aiEnabled} aria-labelledby="ai-switch-label" aria-describedby="ai-switch-description"
                            onClick={handleAiToggle} disabled={savingAi}
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 ${aiEnabled ? "bg-primary" : "bg-muted-foreground/40"}`}>
                            <span aria-hidden="true" className={`inline-block h-5 w-5 rounded-full bg-background shadow transition-transform ${aiEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div>
                </section>
            </div>
        </PageContainer>
    )
}

export default Settings