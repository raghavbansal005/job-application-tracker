import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge"

import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { getApplicationById, deleteApplication } from "@/services/applicationService";

function ApplicationDetails() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [application, setApplication] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [deleteError, setDeleteError] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const loadApplication = async () => {
            try {
                setLoading(true)
                setLoadError(null)

                const data = await getApplicationById(id)
                setApplication(data.application)
            }
            catch (error) {
                console.error("Failed to load application", error)
                setLoadError(error.response?.data?.message || "Failed to load application.")
            }
            finally {
                setLoading(false)
            }
        }
        loadApplication()
    }, [id])

    const handleDelete = async () => {
        try {
            setDeleting(true)
            setDeleteError(null)

            await deleteApplication(id)
            navigate('/applications')
        }
        catch (error) {
            console.error('Failed to delete application', error)
            setDeleteError(error.response?.data?.message || 'Failed to delete application')
        }
        finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <PageContainer>
                <div className="max-w-4xl">
                    <p className="text-sm text-muted-foreground">Loading application...</p>
                </div>
            </PageContainer>
        )
    }

    if (loadError) {
        return (
            <PageContainer>
                <div className="max-w-4xl">
                    <Button variant="ghost" className="-ml-2 mb-6" onClick={() => navigate('/applications')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Back to Applications
                    </Button>
                    <p className="text-sm text-destructive">{loadError}</p>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <div className="max-w-4xl space-y-8">
                <div className="space-y-4">
                    <Button variant="ghost" className="-ml-2" onClick={() => navigate('/applications')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Back to Applications
                    </Button>

                    <PageHeader title={application.jobTitle} description={application.company} action={
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" onClick={() => navigate(`/applications/${application._id}/edit`)}> Edit Application</Button>
                            <AlertDialog>
                                <AlertDialogTrigger render={<Button variant="destructive" disabled={deleting} />}>
                                    <Trash2 className="mr-2 h-4 w-4" />Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Application?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this application? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                                            {deleting ? 'Deleting...' : 'Delete Application'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    } />
                </div>

                <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Application Overview</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Details about this job application</p>
                        </div>
                        <StatusBadge status={application.status} />
                    </div>

                    <div className="mt-6 grid gap-6 border-t border-border/60 pt-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>
                            <p className="mt-1 font-medium text-foreground">{application.company}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Job Title</p>
                            <p className="mt-1 font-medium text-foreground">{application.jobTitle || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Employment Type</p>
                            <p className="mt-1 font-medium text-foreground">{application.employmentType || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Applied Date</p>
                            <p className="mt-1 font-medium text-foreground">{application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Status</p>
                            <p className="mt-1 font-medium text-foreground">{application.status}</p>
                        </div>
                    </div>

                    {application.jobUrl && (
                        <div className="mt-6 border-t border-border/60 pt-6">
                            <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline" >
                                View Job Posting
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    )}
                </div>

                {application.notes && (
                    <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-foreground">Notes</h2>
                        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">{application.notes}</p>
                    </div>
                )}

                {application.jobDescription && (
                    <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-foreground">Job Description</h2>
                        <div className="mt-4 max-h-96 overflow-y-auto rounded-lg border border-border/60 bg-muted/30 p-4">
                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">{application.jobDescription}</p>
                        </div>
                    </div>
                )}

                {deleteError && (
                    <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">{deleteError}</p>
                    </div>
                )}
            </div>
        </PageContainer>
    )
}

export default ApplicationDetails