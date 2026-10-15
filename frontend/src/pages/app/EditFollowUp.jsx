import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/layout/PageHeader"
import FormField from "@/components/common/FormField"

import { Button } from "@/components/ui/button"
import { getFollowUpById, updateFollowUp } from "@/services/followUpService"
import { getApplication } from "@/services/applicationService"
import { getInterviews } from "@/services/interviewService"

const inputClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"

function getId(value) { return typeof value === "string" ? value : value?._id || "" }
function toLocalDateTime(value) {
    if (!value) return ""

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""

    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    return localDate.toISOString().slice(0, 16)
}

function EditFollowUp() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [applications, setApplications] = useState([])
    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [formState, setFormState] = useState({ application: "", interview: "", type: "Application Follow-up", status: "Pending", dueDate: "", notes: "" })

    useEffect(() => {
        const loadFollowUp = async () => {
            try {
                setLoading(true)
                setError(null)

                const [followUpData, applicationData, interviewData] = await Promise.all([getFollowUpById(id), getApplication(), getInterviews()])
                const followUp = followUpData.followUp

                if (!followUp) {
                    throw new Error("Follow-up details were not returned.")
                }

                setApplications(applicationData.applications || [])
                setInterviews(interviewData.interviews || [])
                setFormState({ application: getId(followUp.application), interview: getId(followUp.interview), type: followUp.type || "Application Follow-up", status: followUp.status || "Pending", dueDate: toLocalDateTime(followUp.dueDate), notes: followUp.notes || "" })
            }
            catch (error) {
                console.error("Failed to load follow-up:", error)
                setError(error.response?.data?.message || error.message || "Failed to load follow-up.")
            }
            finally {
                setLoading(false)
            }
        }

        loadFollowUp()
    }, [id])

    const filteredInterviews = interviews.filter((interview) => getId(interview.application) === formState.application)
    const handleChange = (event) => {
        const { name, value } = event.target
        setFormState((previous) => ({ ...previous, [name]: value, ...(name === "application" ? { interview: "" } : {}) }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!formState.dueDate || Number.isNaN(new Date(formState.dueDate).getTime())) {
            setError("Please select a valid due date.")
            return
        }

        try {
            setSaving(true)
            setError(null)

            const followUpData = { application: formState.application, interview: formState.interview || null, type: formState.type, status: formState.status, dueDate: new Date(formState.dueDate).toISOString(), notes: formState.notes.trim() }
            await updateFollowUp(id, followUpData)
            navigate(`/followups/${id}`)
        }
        catch (error) {
            console.error("Failed to update follow-up:", error)
            setError(error.response?.data?.message || "Failed to update follow-up.")
        }
        finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <PageContainer>
                <div className="max-w-3xl">
                    <p className="text-sm text-muted-foreground">Loading follow-up...</p>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="max-w-3xl space-y-8">
                <PageHeader title="Edit Follow-up" description="Update your reminder, due date, and related job application." />
                {error && (
                    <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <FormField id="application" label="Application" required>
                        <select id="application" name="application" value={formState.application} onChange={handleChange} required disabled={saving || applications.length === 0} className={inputClassName}>
                            <option value="">Select an application</option>

                            {applications.map((application) => (
                                <option key={application._id} value={application._id}>
                                    {application.company} — {application.jobTitle}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField id="type" label="Follow-up Type" required>
                        <select id="type" name="type" value={formState.type} onChange={handleChange} required disabled={saving} className={inputClassName}>
                            <option value="Recruiter Follow-up">Recruiter Follow-up</option>
                            <option value="Thank You">Thank You</option>
                            <option value="Application Follow-up">Application Follow-up</option>
                            <option value="Interview Follow-up">Interview Follow-up</option>
                        </select>
                    </FormField>

                    <FormField id="interview" label="Related Interview">
                        <select id="interview" name="interview" value={formState.interview} onChange={handleChange} disabled={saving || !formState.application || filteredInterviews.length === 0} className={inputClassName}>
                            <option value="">No specific interview</option>
                            {filteredInterviews.map((interview) => (
                                <option key={interview._id} value={interview._id}>{interview.round} — {interview.type}</option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-muted-foreground">Only interviews linked to the selected application are shown.</p>
                    </FormField>

                    <FormField id="dueDate" label="Due Date" required>
                        <input id="dueDate" name="dueDate" type="datetime-local" value={formState.dueDate} onChange={handleChange} required disabled={saving} className={inputClassName} />
                    </FormField>

                    <FormField id="status" label="Status" required>
                        <select id="status" name="status" value={formState.status} onChange={handleChange} required disabled={saving} className={inputClassName}>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Skipped">Skipped</option>
                        </select>
                    </FormField>

                    <FormField id="notes" label="Notes">
                        <textarea id="notes" name="notes" value={formState.notes} onChange={handleChange} placeholder="Add any notes about this follow-up..." rows={5} disabled={saving} className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" disabled={saving} onClick={() => navigate(`/followups/${id}`)}>Cancel</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

export default EditFollowUp
