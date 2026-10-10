import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

import { Button } from "@/components/ui/button";
import { getApplication } from "@/services/applicationService";
import { createInterview } from "@/services/interviewService";

function NewInterview() {
    const navigate = useNavigate()

    const [applications, setApplications] = useState([])
    const [loadingApplications, setLoadingApplications] = useState(true)

    const [formState, setFormState] = useState({ application: '', type: 'Online', round: '', scheduledAt: '', interviewer: '', meetingLink: '', notes: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadApplications = async () => {
            try {
                setLoadingApplications(true)
                setError(null)

                const data = await getApplication()
                setApplications(data.applications)
            }
            catch (error) {
                console.error('Failed to load applications.', error)
                setError(error.response?.data?.message || 'Failed to load applications.')
            }
            finally {
                setLoadingApplications(false)
            }
        }
        loadApplications()
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormState((previous) => ({ ...previous, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setLoading(true)
            setError(null)

            await createInterview(formState)
            navigate('/interviews')
        }
        catch (error) {
            console.error('Failed to create interview.', error)
            setError(error.response?.data?.message || 'Failed to create interview.')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <PageContainer>
            <div className="max-w-3xl space-y-8">
                <PageHeader title="Add Interview" description="Add an interview and associate it with a job application." />
                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <div className="space-y-2">
                        <label htmlFor="application" className="text-sm font-medium text-foreground">Application</label>
                        <select id="application" name="application" value={formState.application} onChange={handleChange} required disabled={loadingApplications}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
                            <option value="">{loadingApplications ? "Loading applications..." : "Select an application"}</option>

                            {applications.map((application) => (
                                <option key={application._id} value={application._id}>
                                    {application.company} — {application.jobTitle}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-medium text-foreground">Interview Type</label>
                        <select id="type" name="type" value={formState.type} onChange={handleChange} required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
                            <option value="Online">Online</option>
                            <option value="On-site">On-Site</option>
                            <option value="Phone">Phone</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="round" className="text-sm font-medium text-foreground">Interview Round</label>
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
                        <textarea id="notes" name="notes" value={formState.notes} onChange={handleChange} placeholder="Add any notes about this interview..." rows={4}
                            className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => navigate("/interviews")}>Cancel</Button>
                        <Button type="submit" disabled={loading || loadingApplications}>{loading ? "Creating..." : "Create Interview"}</Button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

export default NewInterview