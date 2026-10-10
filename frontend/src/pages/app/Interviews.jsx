import { useState, useEffect } from "react";
import { Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getInterviews } from "@/services/interviewService";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

function Interviews() {
    const navigate = useNavigate()

    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadInterviews = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getInterviews()
                setInterviews(data.interviews)
            }
            catch (error) {
                console.error('Failed to load interview.', error)
                setError(error.response?.data?.message || 'Failed to load interviews.')
            }
            finally {
                setLoading(false)
            }
        }
        loadInterviews()
    }, [])

    if (loading) {
        return (
            <PageContainer>
                <p className="text-sm text-muted-foreground">Loading interviews...</p>
            </PageContainer>
        )
    }

    if (error) {
        return (
            <PageContainer>
                <p className="text-sm text-destructive">{error}</p>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="space-y-8">
                <PageHeader title='Interviews' description='Manage and track your upcoming and completed interviews.' action={
                    <Button className="w-full sm:w-auto" onClick={() => navigate("/interviews/new")}>
                        <Plus className="mr-2 h-4 w-4" />Add Interview
                    </Button>
                } />

                {interviews.length === 0 ? (
                    <div className="rounded-xl border border-border/60 bg-card p-10 text-center shadow-sm">
                        <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />

                        <h2 className="mt-4 text-lg font-semibold text-foreground">No interviews yet</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Start tracking your interviews by adding your first interview.</p>

                        <Button className="mt-6" onClick={() => navigate("/interviews/new")}><Plus className="mr-2 h-4 w-4" />Add Interview</Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {interviews.map((interview) => (
                            <div key={interview._id} onClick={() => navigate(`/interviews/${interview._id}`)} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="font-semibold text-foreground">{interview.round}</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">{interview.type}</p>
                                    </div>
                                    <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{interview.status}</span>
                                </div>
                                <div className="mt-6 grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interviewer</p>
                                        <p className="mt-1 text-sm font-medium text-foreground">{interview.interviewer || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Scheduled At</p>
                                        <p className="mt-1 text-sm font-medium text-foreground">{interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleString() : "Not scheduled"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interview Type</p>
                                        <p className="mt-1 text-sm font-medium text-foreground">{interview.type}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    )
}

export default Interviews