import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/layout/PageHeader"

import { Button } from "@/components/ui/button"
import { getInterviewById, updateInterview } from "@/services/interviewService"

function EditInterview() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [formState, setFormState] = useState({ type: "Online", round: "", scheduledAt: "", interviewer: "", meetingLink: "", notes: "" })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadInterview = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getInterviewById(id)
                const interview = data.interview

                setFormState({
                    type: interview.type || "Online", round: interview.round || "",
                    scheduledAt: interview.scheduledAt ? new Date(interview.scheduledAt).toISOString().slice(0, 16) : "",
                    interviewer: interview.interviewer || "", meetingLink: interview.meetingLink || "",
                    notes: interview.notes || ""
                })
            }
            catch (error) {
                console.error("Failed to load interview.", error)
                setError(error.response?.data?.message || "Failed to load interview.")
            }
            finally {
                setLoading(false)
            }
        }
        loadInterview()
    }, [id])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormState((previous) => ({ ...previous, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setSaving(true)
            setError(null)

            await updateInterview(id, formState)
            navigate(`/interviews/${id}`)
        }
        catch (error) {
            console.error("Failed to update interview.", error)
            setError(error.response?.data?.message || "Failed to update interview.")
        }
        finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <PageContainer>
                <div className="max-w-3xl">
                    <p className="text-sm text-muted-foreground">Loading interview...</p>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="max-w-3xl space-y-8">
                <PageHeader title="Edit Interview" description="Update the details of your interview." />

                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-medium text-foreground">Interview Type</label>
                        <select id="type" name="type" value={formState.type} onChange={handleChange} required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" >
                            <option value="Online">Online</option>
                            <option value="On-site">On-Site</option>
                            <option value="Phone">Phone</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="round" className="text-sm font-medium text-foreground" >Interview Round</label>
                        <input id="round" name="round" type="text" value={formState.round} onChange={handleChange} placeholder="e.g. Technical Round 1" required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="scheduledAt" className="text-sm font-medium text-foreground">Scheduled At</label>
                        <input id="scheduledAt" name="scheduledAt" type="datetime-local" value={formState.scheduledAt} onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="interviewer" className="text-sm font-medium text-foreground">Interviewer</label>
                        <input id="interviewer" name="interviewer" type="text" value={formState.interviewer} onChange={handleChange} placeholder="e.g. John Smith"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="meetingLink" className="text-sm font-medium text-foreground">Meeting Link</label>
                        <input id="meetingLink" name="meetingLink" type="url" value={formState.meetingLink} onChange={handleChange} placeholder="https://meet.google.com/..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="notes" className="text-sm font-medium text-foreground">Notes</label>
                        <textarea id="notes" name="notes" value={formState.notes} onChange={handleChange} placeholder="Add any notes about this interview..." rows={5}
                            className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => navigate(`/interviews/${id}`)}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

export default EditInterview