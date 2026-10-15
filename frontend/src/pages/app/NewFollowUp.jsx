import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import FormField from "@/components/common/FormField";

import { Button } from "@/components/ui/button";
import { createFollowUp } from "@/services/followUpService";
import { getApplication } from "@/services/applicationService";
import { getInterviews } from "@/services/interviewService";

function NewFollowUp() {
    const navigate = useNavigate()

    const [applications, setApplications] = useState([])
    const [interviews, setInterviews] = useState([])
    const [loadingApplications, setLoadingApplications] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [formState, setFormState] = useState({ application: '', interview: '', type: 'Application Follow-up', dueDate: '', notes: '' })

    useEffect(() => {
        const loadFormData = async () => {
            try {
                setLoadingApplications(true)
                setError(null)

                const [applicationData, interviewData] = await Promise.all([getApplication(), getInterviews()])
                setApplications(applicationData.applications || [])
                setInterviews(interviewData.interviews || [])
            }
            catch (error) {
                console.error('Failed to load follow-up form data:', error)
                setError(error.response?.data?.message || 'Failed to load applications and interviews.')
            }
            finally {
                setLoadingApplications(false)
            }
        }
        loadFormData()
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormState((previous) => ({ ...previous, [name]: value, ...(name === 'application' ? { interview: '' } : {}) }))
    }

    const filteredInterviews = interviews.filter((interview) => {
        const applicationId = typeof interview.application === 'object' ? interview.application?._id : interview.application
        return applicationId === formState.application
    })

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!formState.dueDate || Number.isNaN(new Date(formState.dueDate).getTime())) {
            setError("Please select a valid due date and time.")
            return
        }

        try {
            setLoading(true)
            setError(null)

            const followUpData = { application: formState.application, interview: formState.interview || null, type: formState.type, dueDate: new Date(formState.dueDate).toISOString(), notes: formState.notes.trim() }
            await createFollowUp(followUpData)
            navigate('/followups')
        }
        catch (error) {
            console.error('Failed to create follow-up', error)
            setError(error.response?.data?.message || 'Failed to create follow-up.')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <PageContainer>
            <div className="max-w-3xl space-y-8">
                <PageHeader title="Add Follow-up" description="Schedule a reminder for an application or interview." />
                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <FormField id="application" label="Application" required>
                        <select id="application" name="application" value={formState.application} onChange={handleChange} required disabled={loadingApplications || loading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
                            <option value="">
                                {loadingApplications ? 'Loading applications...' : applications.length === 0 ? 'No applications available' : 'Select an application'}
                            </option>

                            {applications.map((application) => (
                                <option key={application._id} value={application._id}>
                                    {application.company} — {application.jobTitle}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField id="interview" label="Related Interview">
                        <select id="interview" name="interview" value={formState.interview} onChange={handleChange} disabled={loadingApplications || loading || !formState.application || filteredInterviews.length === 0}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
                            <option value="">
                                {!formState.application ? 'Select an application first' : filteredInterviews.length === 0 ? 'No interviews for this application' : 'No related interview (optional)'}
                            </option>

                            {filteredInterviews.map((interview) => (
                                <option key={interview._id} value={interview._id}>
                                    {interview.round} — {interview.type}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField id="type" label="Follow-up Type" required>
                        <select id="type" name="type" value={formState.type} onChange={handleChange} required disabled={loading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
                            <option value="Recruiter Follow-up">Recruiter Follow-up</option>
                            <option value="Thank You">Thank You</option>
                            <option value="Application Follow-up">Application Follow-up</option>
                            <option value="Interview Follow-up">Interview Follow-up</option>
                        </select>
                    </FormField>

                    <FormField id="dueDate" label="Due Date and Time" required>
                        <input id="dueDate" name="dueDate" type="datetime-local" value={formState.dueDate} onChange={handleChange} required disabled={loading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <FormField id="notes" label="Notes">
                        <textarea id="notes" name="notes" value={formState.notes} onChange={handleChange} placeholder="Add context or a reminder..." rows={4} disabled={loading}
                            className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                    </FormField>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" disabled={loading} onClick={() => navigate('/followups')}>Cancel</Button>
                        <Button type="submit" disabled={loading || loadingApplications || applications.length === 0}>{loading ? 'Creating...' : 'Create Follow-up'}</Button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

export default NewFollowUp