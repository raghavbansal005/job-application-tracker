import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge"

import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogAction, AlertDialogContent,
    AlertDialogDescription, AlertDialogHeader, AlertDialogFooter,
    AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel
} from "@/components/ui/alert-dialog";

import { getInterviewById, deleteInterview } from "@/services/interviewService";

function InterviewDetails() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [interview, setInterview] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [deleteError, setDeleteError] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const loadInterview = async () => {
            try {
                setLoading(true)
                setLoadError(null)

                const data = await getInterviewById(id)
                setInterview(data.interview)
            }
            catch (error) {
                console.error("Failed to load interview.", error)
                setLoadError(error.response?.data?.message || "Failed to load interview.")
            }
            finally {
                setLoading(false)
            }
        }
        loadInterview()
    }, [id])

    const handleDelete = async () => {
        try {
            setDeleting(true)
            setDeleteError(null)

            await deleteInterview(id)
            navigate("/interviews")
        }
        catch (error) {
            console.error("Failed to delete interview.", error)
            setDeleteError(error.response?.data?.message || "Failed to delete interview.")
        }
        finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <PageContainer>
                <div className="max-w-4xl">
                    <p className="text-sm text-muted-foreground">Loading interview...</p>
                </div>
            </PageContainer>
        )
    }

    if (loadError) {
        return (
            <PageContainer>
                <div className="max-w-4xl">
                    <Button variant="ghost" onClick={() => navigate("/interviews")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
                    </Button>
                    <p className="mt-6 text-sm text-destructive">{loadError}</p>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="max-w-4xl space-y-8">
                <div className="space-y-4">
                    <Button variant="ghost" className="-ml-2" onClick={() => navigate("/interviews")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
                    </Button>
                    <PageHeader title="Interview Details" description="View and manage your interview details." action={
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={() => navigate(`/interviews/${id}/edit`)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger render={<Button variant="destructive" disabled={deleting} />}>
                                    <Trash2 className="mr-2 h-4 w-4" />Delete
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this interview?</AlertDialogTitle>
                                        <AlertDialogDescription>This action cannot be undone. This interview will be permanently removed from your tracker.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete Interview"}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    } />
                </div>

                {deleteError && (
                    <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{deleteError}</p>
                    </div>
                )}

                <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">{interview.round}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{interview.type} Interview</p>
                        </div>

                        <StatusBadge status={interview.status} />
                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Scheduled At</p>
                            <p className="mt-1 text-sm font-medium text-foreground">{interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleString() : "Not scheduled"}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interviewer</p>
                            <p className="mt-1 text-sm font-medium text-foreground">{interview.interviewer || "Not specified"}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interview Type</p>
                            <p className="mt-1 text-sm font-medium text-foreground">{interview.type}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
                            <p className="mt-1 text-sm font-medium text-foreground">{interview.status}</p>
                        </div>

                    </div>

                    {interview.meetingLink && (
                        <div className="mt-6 border-t border-border/60 pt-6">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Meeting Link</p>
                            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline">
                                Join Interview <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </div>
                    )}

                    {interview.notes && (
                        <div className="mt-6 border-t border-border/60 pt-6">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">{interview.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    )
}

export default InterviewDetails