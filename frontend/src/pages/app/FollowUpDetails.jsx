import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, BriefcaseBusiness, Clock, Pencil, Trash2, LoaderCircle, AlertTriangle } from 'lucide-react'

import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'

import { Button } from '@/components/ui/button'
import { getFollowUpById, deleteFollowUp } from '@/services/followUpService'

function FollowUpDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [followUp, setFollowUp] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteError, setDeleteError] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    useEffect(() => {
        const loadFollowUp = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await getFollowUpById(id)
                setFollowUp(data.followUp)
            }
            catch (error) {
                console.error('Failed to load follow-up:', error)
                setError(error.response?.data?.message || 'Failed to load follow-up.')
            }
            finally {
                setLoading(false)
            }
        }
        loadFollowUp()
    }, [id])

    const handleDelete = async () => {
        try {
            setDeleting(true)
            setDeleteError(null)

            await deleteFollowUp(id)
            navigate('/followups', { replace: true, state: { message: 'Follow-up deleted successfully' } })
        }
        catch (error) {
            console.error('Failed to delete follow-up', error)
            setDeleteError(error.response?.data?.message || 'Failed to delete follow-up. Please try again.')
        }
        finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <PageContainer>
                <p className="text-sm text-muted-foreground">Loading follow-up details...</p>
            </PageContainer>
        )
    }

    if (error || !followUp) {
        return (
            <PageContainer>
                <div className="space-y-4">
                    <p className="text-sm text-destructive">{error || 'Follow-up not found.'}</p>
                    <Button variant="outline" onClick={() => navigate('/followups')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Back to Follow-ups
                    </Button>
                </div>
            </PageContainer>
        )
    }

    const overdue = followUp.status === 'Pending' && new Date(followUp.dueDate) < new Date()
    const formatDate = (date) => new Date(date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

    return (
        <PageContainer>
            <div className="w-full space-y-6">
                <Button variant="ghost" className="-ml-3" onClick={() => navigate('/followups')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />Back to Follow-ups
                </Button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <PageHeader title={followUp.type} description="View your follow-up reminder and related application details." />
                    </div>

                    <div className='flex shrink-0 flex-wrap gap-2'>
                        <Button onClick={() => navigate(`/followups/${id}/edit`)} disabled={deleting}>
                            <Pencil className="mr-2 h-4 w-4" />Edit Follow-up
                        </Button>
                        <Button variant='destructive' disabled={deleting} onClick={() => {
                            setDeleteError(null)
                            setShowDeleteDialog(true)
                        }}>
                            <Trash2 className='mr-2 h-4 w-4' />Delete
                        </Button>
                    </div>
                </div>

                {deleteError && (<div role='alert' className='rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive'>{deleteError}</div>)}

                <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Follow-up status</p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <StatusBadge status={followUp.status} />

                                {overdue && (
                                    <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">Overdue</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Due date</p>
                            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />{formatDate(followUp.dueDate)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-border/60 pt-6">
                        <h2 className="font-semibold text-foreground">Notes</h2>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{followUp.notes?.trim() || 'No notes added.'}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <h2 className="flex items-center gap-2 font-semibold text-foreground">
                        <BriefcaseBusiness className="h-5 w-5" />Related application
                    </h2>

                    {followUp.application ? (
                        <div className="mt-4 space-y-2">
                            <p className="font-medium text-foreground">{followUp.application.company}</p>
                            <p className="text-sm text-muted-foreground">{followUp.application.jobTitle}</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate(`/applications/${followUp.application._id}`)}>
                                View Application
                            </Button>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-muted-foreground">Application details are unavailable.</p>
                    )}
                </div>

                <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                    <h2 className="flex items-center gap-2 font-semibold text-foreground">
                        <Clock className="h-5 w-5" />Related interview
                    </h2>

                    {followUp.interview ? (
                        <div className="mt-4 space-y-2">
                            <p className="font-medium text-foreground">{followUp.interview.round}</p>
                            <p className="text-sm text-muted-foreground">{followUp.interview.type}</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate(`/interviews/${followUp.interview._id}`)}>
                                View Interview
                            </Button>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-muted-foreground">This follow-up is not linked to a specific interview.</p>
                    )}
                </div>
            </div>
            {showDeleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !deleting) {
                        setShowDeleteDialog(false)
                    }
                }}>
                    <div role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description" className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-destructive/10 p-2 text-destructive"><AlertTriangle className="h-5 w-5" /></div>
                            <div className="flex-1">
                                <h2 id="delete-dialog-title" className="font-semibold text-foreground">Delete this follow-up?</h2>
                                <p id="delete-dialog-description" className="mt-2 text-sm leading-6 text-muted-foreground">This will permanently delete this follow-up reminder. This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" disabled={deleting} onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
                                {deleting ? (
                                    <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Deleting...</>
                                ) : (
                                    <><Trash2 className="mr-2 h-4 w-4" />Delete Follow-up</>)}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    )
}

export default FollowUpDetails