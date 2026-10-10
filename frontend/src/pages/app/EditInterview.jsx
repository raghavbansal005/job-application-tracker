import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/layout/PageHeader"
import FormField from "@/components/common/FormField"

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
                    <FormField id="type" label="Interview Type" required>
                        <select id="type" name="type" value={formState.type} onChange={handleChange} required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" >
                            <option value="Online">Online</option>
                            <option value="On-site">On-Site</option>
                            <option value="Phone">Phone</option>
                        </select>
                    </FormField>

                    <FormField id="round" label="Interview Round" required>
                        <input id="round" name="round" type="text" value={formState.round} onChange={handleChange} placeholder="e.g. Technical Round 1" required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <FormField id="scheduledAt" label="Scheduled At">
                        <input id="scheduledAt" name="scheduledAt" type="datetime-local" value={formState.scheduledAt} onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <FormField id="interviewer" label="Interviewer">
                        <input id="interviewer" name="interviewer" type="text" value={formState.interviewer} onChange={handleChange} placeholder="e.g. John Smith"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <FormField id="meetingLink" label="Meeting Link">
                        <input id="meetingLink" name="meetingLink" type="url" value={formState.meetingLink} onChange={handleChange} placeholder="https://meet.google.com/..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <FormField id="notes" label="Notes">
                        <textarea id="notes" name="notes" value={formState.notes} onChange={handleChange} placeholder="Add any notes about this interview..." rows={5}
                            className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

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